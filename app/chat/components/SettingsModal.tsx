import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import EditIcon from '@mui/icons-material/Edit';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { AVAILABLE_MODELS, checkWebGPUSupport } from '@/lib/clientAI';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    modernize: boolean;
    isSpeakEnabled: boolean;
    voiceLanguage: string;
    temperature: number;
    textSize: 'small' | 'medium' | 'large';
    useLocalAI: boolean;
    localAIModel: string;
  };
  onSettingChange: (key: string, value: any) => void;
  conversationTitle: string;
  conversationId: string;
  onClearChat: () => void;
  onDeleteChat: () => void;
  onRenameChat: (newTitle: string) => void;
}

const LANGUAGES = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
  { label: 'Italian', value: 'it-IT' },
  { label: 'Japanese', value: 'ja-JP' },
  { label: 'Chinese', value: 'zh-CN' },
];

const IOSSwitch = styled((props: any) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const SettingsModal: React.FC<SettingsModalProps> = React.memo(({ isOpen, onClose, settings, onSettingChange, conversationTitle, conversationId, onClearChat, onDeleteChat, onRenameChat }) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(conversationTitle);
  const [version, setVersion] = React.useState('2.0.1 (Beta)');
  const [webGPUStatus, setWebGPUStatus] = React.useState<{ supported: boolean; error?: string }>({ supported: true });
  const langMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      checkWebGPUSupport().then(setWebGPUStatus);
      fetch('/api/status')
        .then(res => res.json())
        .then(data => {
          if (data.version) setVersion(data.version);
        })
        .catch(err => console.error("Failed to fetch version:", err));
    }
  }, [isOpen]);

  React.useEffect(() => {
    setNewTitle(conversationTitle);
  }, [conversationTitle]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsLangMenuOpen(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentLangLabel = LANGUAGES.find(l => l.value === (settings.voiceLanguage || 'en-US'))?.label || 'English (US)';

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[1999]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed inset-0 z-[2000] bg-black flex flex-col"
          >
            {/* Header - Matched to Chat Header Height */}
            <div className="py-4 px-6 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: 'white/5', '&:hover': { bgcolor: 'white/10' }, width: 40, height: 40 }}>
                  <ArrowBackIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <h2 className="text-lg font-bold text-white">Settings</h2>
              </div>
            </div>
          
          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-8 max-w-2xl mx-auto w-full">
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Conversation Info</h3>
              <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Title</span>
                    <span className="text-white font-medium text-lg">{conversationTitle}</span>
                  </div>
                  <IconButton 
                    onClick={() => setIsRenameDialogOpen(true)}
                    sx={{ color: 'blue.400', bgcolor: 'blue.600/10', '&:hover': { bgcolor: 'blue.600/20' } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">ID</span>
                  <span className="text-gray-500 font-mono text-sm break-all">{conversationId}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">AI Engine</h3>
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">Engine Location</span>
                      <span className="text-gray-400 text-sm">Choose where Nexo's brain runs</span>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                      <button 
                        onClick={() => onSettingChange('useLocalAI', false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!settings.useLocalAI ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <StorageIcon sx={{ fontSize: 16 }} />
                        Cloud
                      </button>
                      <button 
                        onClick={() => {
                          if (webGPUStatus.supported) {
                            onSettingChange('useLocalAI', true);
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          settings.useLocalAI 
                            ? 'bg-green-600 text-white shadow-lg' 
                            : webGPUStatus.supported 
                              ? 'text-gray-500 hover:text-gray-300' 
                              : 'text-gray-700 cursor-not-allowed'
                        }`}
                        title={webGPUStatus.error}
                      >
                        <ComputerIcon sx={{ fontSize: 16 }} />
                        Browser
                      </button>
                    </div>
                  </div>
                  
                  {!webGPUStatus.supported && (
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 mt-2">
                      <WarningAmberIcon sx={{ color: '#f97316', fontSize: 18, mt: 0.5 }} />
                      <div className="flex flex-col">
                        <span className="text-orange-400 text-[11px] font-bold uppercase tracking-wider">WebGPU Unsupported</span>
                        <p className="text-[10px] text-orange-200/70 leading-relaxed">
                          Your mobile device or browser doesn't support WebGPU. 
                          Try enabling <b>#enable-unsafe-webgpu</b> in <b>chrome://flags</b>.
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    {settings.useLocalAI 
                      ? "Browser AI runs locally on your GPU using WebGPU. No credits needed, but requires a capable device and initial model download (~2GB+)." 
                      : webGPUStatus.supported 
                        ? "Cloud AI runs on Nexo's servers. Faster for older devices, but consumes credit tokens."
                        : "Cloud AI is the only option available for your device. WebGPU is required for Browser AI."
                    }
                  </p>
                </div>

                {settings.useLocalAI && (
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-medium">Local Model</span>
                      <span className="text-gray-400 text-sm mb-2">Select the model to run in your browser</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.model_id}
                          onClick={() => onSettingChange('localAIModel', model.model_id)}
                          className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                            settings.localAIModel === model.model_id
                              ? 'bg-green-600/10 border-green-500/50'
                              : 'bg-black/20 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-sm font-bold ${settings.localAIModel === model.model_id ? 'text-green-400' : 'text-white'}`}>
                              {model.model_id.split('-')[0]} {model.model_id.includes('mini') ? 'Mini' : ''}
                            </span>
                            {model.low_resource_required && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-tighter font-black">Lightweight</span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1 font-mono">{model.model_id}</span>
                          <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">~{model.vram_required_MB}MB VRAM required</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">AI Behavior</h3>
              <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-6">
                 <div className="flex flex-col">
                    <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">Creativity</span>
                        <span className="text-blue-400 font-mono text-sm">{settings.temperature !== undefined ? settings.temperature.toFixed(1) : '0.7'}</span>
                    </div>
                    <span className="text-gray-400 text-sm mb-4">Adjust how creative or precise Nexo should be.</span>
                    <Slider
                      value={typeof settings.temperature === 'number' ? settings.temperature : 0.7}
                      onChange={(_, value) => onSettingChange('temperature', value)}
                      min={0}
                      max={1}
                      step={0.1}
                      sx={{
                        color: '#3b82f6',
                        height: 8,
                        '& .MuiSlider-thumb': {
                          width: 20,
                          height: 20,
                          backgroundColor: '#fff',
                          '&:before': { boxShadow: '0 4px 8px rgba(0,0,0,0.4)' },
                          '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: 'none' },
                        },
                        '& .MuiSlider-rail': { opacity: 0.2, backgroundColor: '#fff' },
                      }}
                    />
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-1">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                    </div>
                 </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Modern Appearance</span>
                    <span className="text-gray-400 text-sm">Enable experimental visual effects</span>
                  </div>
                  <IOSSwitch 
                    checked={settings.modernize} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSettingChange('modernize', e.target.checked)} 
                  />
                </div>

                <div className="flex flex-col gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Text Size</span>
                    <span className="text-gray-400 text-sm">Adjust the font size of chat messages</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 rounded-xl">
                     {['small', 'medium', 'large'].map((size) => (
                        <button
                            key={size}
                            onClick={() => onSettingChange('textSize', size)}
                            className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                (settings.textSize || 'medium') === size 
                                ? 'bg-white/10 text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                     ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Voice & Audio</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Voice Responses</span>
                    <span className="text-gray-400 text-sm">Read out model responses automatically</span>
                  </div>
                  <IOSSwitch 
                    checked={settings.isSpeakEnabled} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSettingChange('isSpeakEnabled', e.target.checked)} 
                  />
                </div>
                
                <div className={`flex flex-col gap-3 p-5 rounded-3xl bg-white/[0.03] border border-white/5 transition-all duration-500 ${!settings.isSpeakEnabled ? 'opacity-30 pointer-events-none' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Voice Language</span>
                    <span className="text-gray-400 text-sm mb-4">Select the language for text-to-speech</span>
                  </div>
                  
                  <div className="relative" ref={langMenuRef}>
                    <button
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm hover:bg-white/10 transition-all active:scale-[0.99]"
                    >
                      <span className="font-medium text-blue-400">{currentLangLabel}</span>
                      <motion.div
                        animate={{ rotate: isLangMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M7.247 11.14 2.451 5.658C2.185 5.355 2.398 5 2.851 5h9.448c.453 0 .666.355.402.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isLangMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute bottom-full mb-3 left-0 right-0 z-[2100] bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl"
                        >
                          <div className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar">
                            {LANGUAGES.map((lang) => (
                              <button
                                key={lang.value}
                                onClick={() => {
                                  onSettingChange('voiceLanguage', lang.value);
                                  setIsLangMenuOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3.5 text-sm transition-colors flex items-center justify-between ${
                                  (settings.voiceLanguage || 'en-US') === lang.value
                                    ? 'bg-blue-600/10 text-blue-400 font-bold'
                                    : 'text-gray-300 hover:bg-white/5'
                                }`}
                              >
                                {lang.label}
                                {(settings.voiceLanguage || 'en-US') === lang.value && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 ml-1">Danger Zone</h3>
              <div className="space-y-3">
                 <button 
                    onClick={() => setIsClearConfirmOpen(true)}
                    className="w-full flex items-center justify-between p-5 rounded-3xl bg-red-500/[0.05] border border-red-500/10 hover:bg-red-500/10 transition-colors group"
                 >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
                            <CleaningServicesIcon fontSize="small" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-red-400 font-medium">Clear Chat History</span>
                            <span className="text-red-500/50 text-sm text-left">Remove all messages in this chat</span>
                        </div>
                    </div>
                 </button>

                 <button 
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="w-full flex items-center justify-between p-5 rounded-3xl bg-red-500/[0.05] border border-red-500/10 hover:bg-red-500/10 transition-colors group"
                 >
                    <div className="flex items-center gap-3">
                         <div className="p-2 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
                            <DeleteIcon fontSize="small" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-red-400 font-medium">Delete Conversation</span>
                            <span className="text-red-500/50 text-sm text-left">Permanently delete this conversation</span>
                        </div>
                    </div>
                 </button>
              </div>
            </section>
            
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">About</h3>
              <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Version</span>
                  <span className="text-gray-500 font-mono">{version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Engine</span>
                  <span className="text-gray-500">Nexo Intelligence</span>
                </div>
                <div className="pt-4 border-t border-white/5 space-y-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Nexo is an advanced AI assistant designed for research and academic purposes. 
                        Your settings are saved locally to your device and synchronized across your chat sessions.
                    </p>
                    <button 
                      onClick={() => window.open('/status', '_blank')}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <ShowChartIcon sx={{ fontSize: 14, color: 'blue.500' }} />
                      Check System Status
                    </button>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </>
      )}
    </AnimatePresence>
    
    {/* Confirmation Dialogs */}
    <Dialog 
      open={isClearConfirmOpen} 
      onClose={() => setIsClearConfirmOpen(false)} 
      sx={{ zIndex: 3000 }}
      PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: '24px', p: 1, border: '1px solid rgba(255,255,255,0.1)' } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Clear Chat History?</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'gray' }}>Are you sure you want to clear all messages? This cannot be undone.</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setIsClearConfirmOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
        <Button 
          onClick={() => {
            onClearChat();
            setIsClearConfirmOpen(false);
          }} 
          variant="contained" 
          color="error" 
          sx={{ borderRadius: '50px' }}
        >
          Clear History
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog 
      open={isDeleteConfirmOpen} 
      onClose={() => setIsDeleteConfirmOpen(false)} 
      sx={{ zIndex: 3000 }}
      PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: '24px', p: 1, border: '1px solid rgba(255,255,255,0.1)' } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Conversation?</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'gray' }}>This will permanently remove this conversation and all its messages. This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setIsDeleteConfirmOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
        <Button 
          onClick={() => {
            onDeleteChat();
            setIsDeleteConfirmOpen(false);
          }} 
          variant="contained" 
          color="error" 
          sx={{ borderRadius: '50px' }}
        >
          Delete Permanently
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog 
      open={isRenameDialogOpen} 
      onClose={() => setIsRenameDialogOpen(false)} 
      sx={{ zIndex: 3000 }}
      PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: '24px', p: 1, border: '1px solid rgba(255,255,255,0.1)' } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Rename Chat</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="New Title"
          fullWidth
          variant="outlined"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
            },
            '& .MuiInputLabel-root': { color: 'gray' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setIsRenameDialogOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
        <Button 
          onClick={() => {
            if (newTitle.trim() && newTitle.trim() !== conversationTitle) {
              onRenameChat(newTitle.trim());
            }
            setIsRenameDialogOpen(false);
          }} 
          variant="contained" 
          sx={{ bgcolor: 'blue.600', borderRadius: '50px', '&:hover': { bgcolor: 'blue.700' } }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
});

SettingsModal.displayName = 'SettingsModal';

export default SettingsModal;