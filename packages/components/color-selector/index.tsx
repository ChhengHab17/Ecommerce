import { Controller } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const defaultColors = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFF000', // Yellow
  '#FFA500', // Orange
  '#800080', // Purple
  '#00FFFF', // Cyan
];

const ColorSelector = ({ control, error }: any) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');

  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-1">Color</label>
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-3">
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ['#ffffff', '#ffff00'].includes(
                color.toLowerCase(),
              );
              return (
                <button
                  type="button"
                  key={color}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color],
                    )
                  }
                  className={`w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center transition border-2 border-slate-500 ${
                    isSelected ? 'scale-110 border-white' : 'border-transparent'
                  } ${isLightColor ? 'border-gray-600' : ''}`}
                  style={{ backgroundColor: color }}
                />
              );
            })}

            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 border-gray-800 hover:bg-gray-700 transition"
            >
              <Plus size={16} color="white" />
            </button>

            {showColorPicker && (
              <div className="relative flex items-center gap-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-10 h-10 p-0 border-none cursor-pointer"
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm"
                  onClick={() => {
                    setCustomColors([...customColors, newColor]);
                    setShowColorPicker(false);
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ColorSelector;
