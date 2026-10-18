import { Controller, useFieldArray } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import Input from '../input';

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    { label: string; value: string[] }[]
  >([]);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Controller
          name={`customProperties`}
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, value: [] }]);
              setNewLabel('');
            };
            const addValue = (index: number) => {
              if (!newValue.trim()) return;
              const updatedProperties = [...properties];
              updatedProperties[index].value.push(newValue);
              setProperties(updatedProperties);
              setNewValue('');
            };

            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };

            return (
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Custom Properties
                </label>
                <div className="flex flex-col gap-2">
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 p-3 rounded-lg bg-gray-900"
                    >
                      <div className="flex items-center justify between">
                        <span className="font-semibold text-gray-300">
                          {property.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProperty(index)}
                        >
                          <X
                            size={16}
                            className="text-red-500 hover:text-red-700"
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => addValue(index)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {property.value.map((value, valueIndex) => (
                          <span
                            key={valueIndex}
                            className="bg-gray-700 text-gray-300 text-sm py-1 px-2 rounded-md"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Enter property label"
                      value={newLabel}
                      onChange={(e: any) => setNewLabel(e.target.value)}
                    />
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                      type="button"
                      onClick={addProperty}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                  {errors.customProperties && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customProperties.message as string}
                    </p>
                  )}
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
