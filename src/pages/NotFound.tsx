import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { pageTransition } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const NotFound = () => {
  const navigate = useNavigate();
  useDocumentTitle('Page Not Found');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div {...pageTransition} className="glass-panel max-w-sm p-8 text-center">
        <p className="mb-4 text-7xl font-extrabold text-[#8A8A8A]/30">404</p>
        <h1 className="mb-2 text-xl font-bold text-[#1A1A1A]">Page not found</h1>
        <p className="mb-6 text-sm text-[#8A8A8A]">
          The page you're looking for doesn't exist or has been removed.
        </p>
        <GlassButton onClick={() => navigate('/')}>Go Back Home</GlassButton>
      </motion.div>
    </div>
  );
};

export default NotFound;
