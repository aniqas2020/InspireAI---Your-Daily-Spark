
import React, { useState, useCallback, useRef } from 'react';
import { 
  Category, Tone, Length, Style, AspectRatio, 
  QuoteData, GenerationConfig, CanvasSettings 
} from './types';
import { generateQuote, generateImage } from './services/geminiService';
import QuoteCanvas from './components/QuoteCanvas';
import { 
  Sparkles, Download, RefreshCw, Share2, 
  Palette, Type as TypeIcon, Layout, Settings,
  Check, Instagram, Twitter
} from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    category: Category.SUCCESS,
    tone: Tone.POWERFUL,
    length: Length.SHORT,
    style: Style.AESTHETIC,
    aspectRatio: AspectRatio.SQUARE
  });

  const [settings, setSettings] = useState<CanvasSettings>({
    fontSize: 60,
    textColor: '#FFFFFF',
    fontFamily: 'font-modern',
    position: 'center',
    overlayOpacity: 0.3
  });

  const [quote, setQuote] = useState<QuoteData>({
    text: "Your potential is limited only by your imagination.",
    author: "InspireAI"
  });

  const [imageUrl, setImageUrl] = useState<string>("https://picsum.photos/1080/1080?nature");
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('content');

  const handleInspire = async () => {
    setIsGenerating(true);
    try {
      const [newQuote, newImage] = await Promise.all([
        generateQuote(config),
        generateImage(config)
      ]);
      setQuote(newQuote);
      setImageUrl(newImage);
    } catch (error) {
      console.error("Inspiration failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!exportedImageUrl) return;
    const link = document.createElement('a');
    link.href = exportedImageUrl;
    link.download = `inspire-ai-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share && exportedImageUrl) {
        try {
            const blob = await (await fetch(exportedImageUrl)).blob();
            const file = new File([blob], 'inspire.png', { type: 'image/png' });
            await navigator.share({
                title: 'Daily Inspiration',
                text: 'Check out this quote I generated with InspireAI!',
                files: [file]
            });
        } catch (err) {
            console.error('Sharing failed', err);
        }
    } else {
        alert('Sharing not supported on this browser. Try downloading!');
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5 py-4 px-6 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              InspireAI
            </h1>
          </div>
          <button 
            onClick={handleInspire}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20
              ${isGenerating 
                ? 'bg-indigo-600/50 cursor-wait' 
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'}`}
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'Inspire Me'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Preview Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="sticky top-24">
            <QuoteCanvas 
              quote={quote}
              imageUrl={imageUrl}
              settings={settings}
              aspectRatio={config.aspectRatio}
              onExport={setExportedImageUrl}
            />
            
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors shadow-xl"
              >
                <Share2 className="w-5 h-5" />
                Share to Social
              </button>
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="lg:col-span-5">
          <div className="bg-gray-900 border border-white/5 rounded-3xl p-6 shadow-2xl space-y-8">
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-800/50 p-1 rounded-2xl">
              {[
                { id: 'content', icon: Sparkles, label: 'Content' },
                { id: 'style', icon: Palette, label: 'Style' },
                { id: 'layout', icon: Layout, label: 'Layout' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all
                    ${activeTab === tab.id ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Controls */}
            {activeTab === 'content' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Inspiration Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(Category).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setConfig({ ...config, category: cat })}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all
                          ${config.category === cat ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-gray-800/50 border-white/5 text-gray-400 hover:bg-gray-800'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Tone & Length</label>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.values(Tone).map((t) => (
                        <button
                          key={t}
                          onClick={() => setConfig({ ...config, tone: t })}
                          className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all
                            ${config.tone === t ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-gray-800/50 border-white/5 text-gray-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {Object.values(Length).map((l) => (
                        <button
                          key={l}
                          onClick={() => setConfig({ ...config, length: l })}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all
                            ${config.length === l ? 'bg-orange-600/20 border-orange-500 text-orange-400' : 'bg-gray-800/50 border-white/5 text-gray-400'}`}
                        >
                          {l} Quote
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Custom Edit</label>
                  <textarea 
                    value={quote.text}
                    onChange={(e) => setQuote({ ...quote, text: e.target.value })}
                    className="w-full bg-gray-800 border border-white/5 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                    placeholder="Type your own inspiration..."
                  />
                </section>
              </div>
            )}

            {/* Style Controls */}
            {activeTab === 'style' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Background Aesthetic</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(Style).map((s) => (
                      <button
                        key={s}
                        onClick={() => setConfig({ ...config, style: s })}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all
                          ${config.style === s ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-gray-800/50 border-white/5 text-gray-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Typography</label>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {[
                        { id: 'font-modern', label: 'Modern' },
                        { id: 'font-serif', label: 'Serif' },
                        { id: 'font-script', label: 'Handwritten' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSettings({ ...settings, fontFamily: f.id as any })}
                          className={`flex-1 py-3 rounded-xl border text-sm transition-all
                            ${settings.fontFamily === f.id ? 'bg-white text-black border-white' : 'bg-gray-800 border-white/5 text-gray-400'}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">Font Size</span>
                        <span className="text-xs text-white">{settings.fontSize}px</span>
                      </div>
                      <input 
                        type="range" min="20" max="120" step="2"
                        value={settings.fontSize}
                        onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Overlay Intensity</label>
                  <input 
                    type="range" min="0" max="0.9" step="0.05"
                    value={settings.overlayOpacity}
                    onChange={(e) => setSettings({ ...settings, overlayOpacity: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </section>
              </div>
            )}

            {/* Layout Controls */}
            {activeTab === 'layout' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Canvas Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.values(AspectRatio).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setConfig({ ...config, aspectRatio: ratio })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all
                          ${config.aspectRatio === ratio ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-gray-800/50 border-white/5 text-gray-400'}`}
                      >
                        <div className={`border-2 border-current rounded ${ratio === AspectRatio.SQUARE ? 'w-6 h-6' : ratio === AspectRatio.STORY ? 'w-4 h-7' : 'w-7 h-5'}`} />
                        <span className="text-[10px] font-bold uppercase">{ratio === AspectRatio.SQUARE ? 'Square' : ratio === AspectRatio.STORY ? 'Story' : 'Desktop'}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-sm font-semibold text-gray-400 mb-3 block">Text Position</label>
                  <div className="flex gap-2">
                    {['top', 'center', 'bottom'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setSettings({ ...settings, position: pos as any })}
                        className={`flex-1 py-3 rounded-xl border text-sm capitalize transition-all
                          ${settings.position === pos ? 'bg-white text-black border-white' : 'bg-gray-800 border-white/5 text-gray-400'}`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

          </div>

          <div className="mt-8 p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-3xl">
             <h3 className="text-indigo-400 font-semibold mb-2 flex items-center gap-2">
               <Settings className="w-4 h-4" />
               Tips for Creators
             </h3>
             <ul className="text-xs text-indigo-300/80 space-y-2">
               <li>• Use <b>Story</b> (9:16) for Instagram or TikTok.</li>
               <li>• <b>Handwritten</b> fonts work best with Aesthetic/Bright styles.</li>
               <li>• Use <b>Dark</b> style for high-contrast, impactful quotes.</li>
               <li>• Adjust <b>Overlay</b> to make text pop on busy backgrounds.</li>
             </ul>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-10 text-center">
        <p className="text-gray-500 text-sm">Made with 💖 and Gemini AI. Share the positivity.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="text-gray-600 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href="#" className="text-gray-600 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
        </div>
      </footer>
    </div>
  );
};

export default App;
