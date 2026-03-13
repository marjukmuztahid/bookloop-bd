import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { pageTransition, springButton } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAppToast } from '@/components/ui/GlassToast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { BookCondition, Curriculum } from '@/types';

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const CURRICULUMS: Array<{ label: string; value: Curriculum }> = [
  { label: 'Bangla Version', value: 'bangla_version' },
  { label: 'English Version', value: 'english_version' },
  { label: 'English Medium', value: 'english_medium' },
];
const CLASS_LEVELS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'SSC', 'HSC 1st Year', 'HSC 2nd Year', 'O-Level', 'A-Level',
];
const CONDITIONS: Array<{ value: BookCondition; label: string; desc: string }> = [
  { value: 'new', label: 'Like New', desc: 'Unused, no marks' },
  { value: 'good', label: 'Good', desc: 'Minor wear, no writing' },
  { value: 'fair', label: 'Fair', desc: 'Some marks or highlights' },
  { value: 'worn', label: 'Worn', desc: 'Heavy use but readable' },
];
const WEIGHTS = [
  { label: 'Under 2 kg', value: 1 },
  { label: '2 – 4 kg', value: 3 },
  { label: 'Above 4 kg', value: 5 },
];

const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const SellBook = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useAppToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [curriculum, setCurriculum] = useState<Curriculum | ''>('');
  const [classLevel, setClassLevel] = useState('');
  const [condition, setCondition] = useState<BookCondition | ''>('');
  const [weight, setWeight] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Guard: still loading profile
  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8357A] border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  // Guard: need payment info
  if (!profile.bkash_nagad_number) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
          <div className="glass-panel max-w-md p-8 text-center">
            <h2 className="mb-2 text-lg font-bold text-[#1A1A1A]">Add Payment Info First</h2>
            <p className="mb-5 text-sm text-[#8A8A8A]">
              You need to add your bKash or Nagad number before listing a book. This is where we'll send your payment after delivery.
            </p>
            <GlassButton onClick={() => navigate('/dashboard?tab=profile')}>Go to Profile Settings</GlassButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024
    );
    const total = [...photos, ...newFiles].slice(0, 3);
    setPhotos(total);
    setPhotoPreviews(total.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(photoPreviews[i]);
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPhotoPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const priceNum = parseFloat(price) || 0;
  const buyerPays = Math.round(priceNum * 1.05);

  const resetForm = () => {
    setPhotos([]); setPhotoPreviews([]); setBookName(''); setAuthor('');
    setCurriculum(''); setClassLevel(''); setCondition(''); setWeight(null);
    setPrice(''); setDescription(''); setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!photos.length) { showToast('Add at least 1 photo', 'error'); return; }
    if (!bookName.trim()) { showToast('Book name is required', 'error'); return; }
    if (!author.trim()) { showToast('Author/Publisher is required', 'error'); return; }
    if (!curriculum) { showToast('Select a curriculum', 'error'); return; }
    if (!classLevel) { showToast('Select a class level', 'error'); return; }
    if (!condition) { showToast('Select a condition', 'error'); return; }
    if (weight === null) { showToast('Select a weight', 'error'); return; }
    if (priceNum < 10) { showToast('Minimum price is ৳ 10', 'error'); return; }
    if (!user) { showToast('Please log in first', 'error'); return; }

    setSubmitting(true);
    try {
      // Upload photos
      const photoUrls: string[] = [];
      for (const file of photos) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('book-photos')
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('book-photos').getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }

      // Insert listing
      const { error } = await supabase.from('listings').insert({
        seller_id: user.id,
        book_name: bookName.trim(),
        author_publisher: author.trim(),
        curriculum,
        class_level: classLevel,
        condition,
        weight_kg: weight,
        seller_price: priceNum,
        photos: photoUrls,
        description: description.trim() || null,
        status: 'pending',
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error('Listing submission error:', err);
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass-panel max-w-md p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(48,209,88,0.12)]">
              <CheckCircle size={32} className="text-[#30D158]" />
            </motion.div>
            <h2 className="mb-2 text-xl font-bold text-[#1A1A1A]">Listing Submitted!</h2>
            <p className="mb-6 text-sm text-[#8A8A8A]">
              Our team will review your listing and notify you by email once it's approved. This usually takes a few hours.
            </p>
            <div className="flex flex-col gap-2">
              <GlassButton className="w-full" onClick={() => navigate('/dashboard')}>View My Listings</GlassButton>
              <GlassButton variant="secondary" className="w-full" onClick={resetForm}>List Another Book</GlassButton>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main {...pageTransition} className="mx-auto max-w-[640px] px-4 pb-16 pt-24">
        <h1 className="mb-6 text-2xl font-extrabold text-[#1A1A1A]">List a Book for Sale</h1>

        <div className="glass-panel flex flex-col gap-5 p-6">
          {/* 1. Photos */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#3A3A3A]">Photos (up to 3)</label>
            {photoPreviews.length > 0 && (
              <div className="mb-3 flex gap-2">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photos.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}
                className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[rgba(232,53,122,0.30)] bg-[rgba(232,53,122,0.03)] p-6 transition-colors hover:border-[rgba(232,53,122,0.50)]"
              >
                <Upload size={24} className="text-[#E8357A]" />
                <p className="text-xs text-[#8A8A8A]">Click or drag photos here (JPG, PNG, WEBP, max 5MB)</p>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple
              onChange={(e) => addPhotos(e.target.files)} className="hidden" />
          </div>

          {/* 2. Book Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Book Name</label>
            <input value={bookName} onChange={(e) => setBookName(e.target.value)} className={INPUT_CLASS} placeholder="Enter book name" />
          </div>

          {/* 3. Author / Publisher */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Author / Publisher</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className={INPUT_CLASS} placeholder="e.g. NCTB, Oxford" />
          </div>

          {/* 4. Curriculum */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#3A3A3A]">Curriculum Type</label>
            <div className="flex gap-2">
              {CURRICULUMS.map((c) => (
                <PillToggle key={c.value} active={curriculum === c.value} onClick={() => setCurriculum(c.value)}>{c.label}</PillToggle>
              ))}
            </div>
          </div>

          {/* 5. Class Level */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Class Level</label>
            <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}
              className={`${INPUT_CLASS} appearance-none ${!classLevel ? 'text-[#8A8A8A]' : ''}`}>
              <option value="">Select class</option>
              {CLASS_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* 6. Condition */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#3A3A3A]">Book Condition</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CONDITIONS.map((c) => (
                <motion.button
                  key={c.value}
                  {...springButton}
                  onClick={() => setCondition(c.value)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    condition === c.value
                      ? 'border-[rgba(232,53,122,0.40)] bg-[rgba(232,53,122,0.06)]'
                      : 'border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)]'
                  }`}
                >
                  <p className={`text-xs font-bold ${condition === c.value ? 'text-[#E8357A]' : 'text-[#3A3A3A]'}`}>{c.label}</p>
                  <p className="mt-0.5 text-[10px] text-[#8A8A8A]">{c.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 7. Weight */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#3A3A3A]">Approximate Weight</label>
            <div className="flex gap-2">
              {WEIGHTS.map((w) => (
                <PillToggle key={w.label} active={weight === w.value} onClick={() => setWeight(w.value)}>{w.label}</PillToggle>
              ))}
            </div>
          </div>

          {/* 8. Price */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Your Price (৳)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              className={INPUT_CLASS} placeholder="Enter amount in BDT" min={10} />
            {priceNum >= 10 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#8A8A8A]">Buyer pays: <span className="font-semibold">{formatPrice(buyerPays)}</span></span>
                <span className="inline-flex items-center rounded-full border border-[rgba(48,209,88,0.25)] bg-[rgba(48,209,88,0.10)] px-2.5 py-0.5 text-[10px] font-semibold text-[#1A7A35]">
                  You receive: {formatPrice(priceNum)}
                </span>
              </div>
            )}
          </div>

          {/* 9. Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              className={`${INPUT_CLASS} min-h-[80px] resize-none`}
              placeholder="Any extra details about the book's condition, edition, or contents..." />
            <p className="mt-1 text-right text-[10px] text-[#8A8A8A]">{description.length}/300</p>
          </div>

          {/* Submit */}
          <GlassButton className="w-full py-3" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit for Review'}
          </GlassButton>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

const PillToggle = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}
    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
      active ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]' : 'bg-[rgba(0,0,0,0.04)] text-[#8A8A8A] hover:text-[#3A3A3A]'
    }`}>
    {children}
  </button>
);

export default SellBook;

