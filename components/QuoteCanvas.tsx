
import React, { useRef, useEffect } from 'react';
import { QuoteData, CanvasSettings, AspectRatio } from '../types';

interface QuoteCanvasProps {
  quote: QuoteData;
  imageUrl: string;
  settings: CanvasSettings;
  aspectRatio: AspectRatio;
  onExport: (dataUrl: string) => void;
}

const QuoteCanvas: React.FC<QuoteCanvasProps> = ({ quote, imageUrl, settings, aspectRatio, onExport }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas size based on aspect ratio
      const baseWidth = 1080;
      let width = baseWidth;
      let height = baseWidth;

      if (aspectRatio === AspectRatio.STORY) {
        height = baseWidth * (16 / 9);
      } else if (aspectRatio === AspectRatio.WALLPAPER) {
        height = baseWidth * (3 / 4);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw Image
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Draw Overlay
      ctx.fillStyle = `rgba(0, 0, 0, ${settings.overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text Settings
      const fontName = settings.fontFamily === 'font-modern' ? 'Montserrat' : 
                      settings.fontFamily === 'font-serif' ? 'Playfair Display' : 'Great Vibes';
      ctx.fillStyle = settings.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const maxWidth = canvas.width * 0.8;
      const xText = canvas.width / 2;
      let yText = canvas.height / 2;

      if (settings.position === 'top') yText = canvas.height * 0.25;
      if (settings.position === 'bottom') yText = canvas.height * 0.75;

      // Multi-line text wrapping
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        const lines = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        const totalHeight = lines.length * lineHeight;
        let startY = y - (totalHeight / 2) + (lineHeight / 2);

        lines.forEach((line) => {
          ctx.fillText(line.trim(), x, startY);
          startY += lineHeight;
        });

        return startY;
      };

      ctx.font = `italic 400 ${Math.round(settings.fontSize * 0.8)}px ${fontName}`;
      const mainFontSize = settings.fontSize;
      ctx.font = `${settings.fontFamily === 'font-script' ? '400' : '700'} ${mainFontSize}px ${fontName}`;
      
      const lastY = wrapText(quote.text, xText, yText, maxWidth, mainFontSize * 1.3);

      // Draw Author
      if (quote.author) {
        ctx.font = `300 ${Math.round(mainFontSize * 0.4)}px ${fontName}`;
        ctx.fillText(`— ${quote.author}`, xText, lastY + (mainFontSize * 0.5));
      }

      onExport(canvas.toDataURL('image/png'));
    };
  };

  useEffect(() => {
    draw();
  }, [quote, imageUrl, settings, aspectRatio]);

  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black aspect-square md:aspect-auto">
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto object-contain max-h-[70vh] rounded-xl"
      />
    </div>
  );
};

export default QuoteCanvas;
