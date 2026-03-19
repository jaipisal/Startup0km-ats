import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutDialog = ({ open, onConfirm, onCancel }: LogoutDialogProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop with progressive blur */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-background/40"
          onClick={onCancel}
        />
        
        {/* Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10, rotateX: -10 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 400,
            opacity: { duration: 0.2 }
          }}
          className="relative z-10 w-full max-w-[380px] perspective-1000"
        >
          <div className="glass-strong rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border-white/60 text-center space-y-8 relative overflow-hidden group">
            {/* Subtle internal glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative mx-auto w-20 h-20 rounded-[2.2rem] bg-gradient-to-br from-destructive/10 to-orange-500/10 flex items-center justify-center shadow-inner"
            >
              <div className="absolute inset-0 rounded-[2.2rem] border border-destructive/20" />
              <motion.div
                animate={{ 
                  x: [0, 2, 0],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <LogOut className="h-9 w-9 text-destructive" />
              </motion.div>
            </motion.div>

            <div className="space-y-2 relative">
              <h3 className="text-2xl font-display font-black text-foreground tracking-tight">Leaving so soon?</h3>
              <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed px-4">
                We'll save your progress. You'll need to sign back in to continue your hiring journey.
              </p>
            </div>

            <div className="flex flex-col gap-3 relative pt-2">
              <Button 
                variant="destructive" 
                className="w-full rounded-2xl h-14 text-sm font-bold shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
                onClick={onConfirm}
              >
                <Sparkles className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" /> Confirm Log out
              </Button>
              <Button 
                variant="ghost" 
                className="w-full rounded-2xl h-12 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-black/5 transition-all" 
                onClick={onCancel}
              >
                Stay on Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default LogoutDialog;
