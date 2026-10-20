import { Controller } from 'react-hook-form';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const SizeSelector = ({ control, errors }: any) => {
  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700">Size *</label>
      <Controller
        name="size"
        control={control}
        render={({ field }) => (
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => {
              const isSelected = (field.value || []).includes(size);
              return (
                <button
                  key={size}
                  type="button"
                   className={`px-3 py-1 border rounded-md ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((s: string) => s !== size)
                        : [...(field.value || []), size],
                    )
                  }
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};
