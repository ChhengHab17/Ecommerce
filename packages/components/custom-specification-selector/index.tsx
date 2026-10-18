import { Controller, useFieldArray } from 'react-hook-form';
import React from 'react';
import Input from '../input';
import { Trash2, PlusCircle } from 'lucide-react';

const CustomSpecifications = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_specifications',
  });
  return (
    <div>
      <label className="block font-semibold text-gray-300 mb-1">
        Custom Specifications
      </label>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2">
            <Controller
              name={`custom_specifications.${index}.name`}
              control={control}
              rules={{ required: 'Specification name is required' }}
              render={({ field }) => (
                <Input
                  label="Specification Name"
                  placeholder="Battery Life, Materials"
                  {...field}
                />
              )}
            />

            <Controller
              name={`custom_specifications.${index}.value`}
              control={control}
              rules={{ required: 'Specification value is required' }}
              render={({ field }) => (
                <Input
                  label="Specification Value"
                  placeholder="1 year, Aluminum"
                  {...field}
                />
              )}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          onClick={() => append({ name: '', value: '' })}
        >
          <PlusCircle size={16} />
          Add Specification
        </button>
      </div>
      {errors.custom_specifications && (
        <p className="text-red-500 text-sm mt-1">
          {errors.custom_specifications.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomSpecifications;
