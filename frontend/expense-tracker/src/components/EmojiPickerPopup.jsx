import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { SmilePlus } from 'lucide-react';

/**
 * EmojiPickerPopup — Emoji selector that shows/hides on button click
 * Props: selectedEmoji (string), onSelect (emoji string → void)
 */
const EmojiPickerPopup = ({ selectedEmoji, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (emojiData) => {
    onSelect(emojiData.emoji);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-xl hover:border-[#1FB6D5] hover:bg-[#E0F2FE] transition-all duration-200"
        title="Pick an emoji"
      >
        {selectedEmoji ? (
          <span>{selectedEmoji}</span>
        ) : (
          <SmilePlus size={20} className="text-[#9CA3AF]" />
        )}
      </button>

      {open && (
        <div className="absolute top-14 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden">
          <EmojiPicker
            onEmojiClick={handleSelect}
            autoFocusSearch={false}
            height={380}
            width={320}
            previewConfig={{ showPreview: false }}
            searchPlaceholder="Search emoji..."
            skinTonesDisabled
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
