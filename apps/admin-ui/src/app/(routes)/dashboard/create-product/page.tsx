'use client';
import ImagePlaceHolder from 'apps/admin-ui/src/shared/components/image-placeholder';
import { ChevronRight } from 'lucide-react';
import Input from 'packages/components/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ColorSelector from 'packages/components/color-selector';
import CustomSpecifications from 'packages/components/custom-specification-selector';
import CustomProperties from 'packages/components/custom-properties';

const Page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null); // Add a new empty slot for the next image
    }
    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  const handelRemoveImage = (index: number) => {
    setImages((prevImages) => {
      let updatedImages = [...prevImages];
      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      return updatedImages;
    });
    setValue('images', images);
  };

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight size={20} className="opacity-[0.8]" />
        <span>Create Product</span>
      </div>

      <div className="py-4 w-full flex gap-6">
        <div className="md:w-[35%]">
          <ImagePlaceHolder
            setOpenImageModal={setOpenImageModal}
            size="765x850"
            small={false}
            index={0}
            onImageChange={handleImageChange}
            onRemove={handelRemoveImage}
          />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((image, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                size="765 x 850"
                key={index}
                small={true}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handelRemoveImage}
                defaultImage={image ? URL.createObjectURL(image) : null}
              />
            ))}
          </div>
        </div>

        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            <div className="w-2/4">
              <Input
                label="Product title *"
                placeholder="Enter product title"
                {...register('title', {
                  required: 'Product title is required',
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message as string}
                </p>
              )}
              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Product description * (Max 150 words)"
                  placeholder="Enter product description"
                  {...register('description', {
                    required: 'Product description is required',
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        'Description must be 150 words or less'
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Tag *"
                  placeholder="Apple, flagship"
                  {...register('tags', {
                    required: 'Separate tags with commas',
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Warranty *"
                  placeholder="1 year / No warranty"
                  {...register('warranty', {
                    required: 'Warranty information is required',
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Slug *"
                  placeholder="Product slug"
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: 'Slug must be lowercase and can contain hyphens',
                    },
                    minLength: {
                      value: 3,
                      message: 'Slug must be at least 3 characters long',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Slug must be at most 50 characters long',
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Brand"
                  placeholder="Apple"
                  {...register('brand')}
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <ColorSelector control={control} error={errors} />
              </div>
              <div className="mt-2">
                <CustomSpecifications control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <CustomProperties control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Cash on Delivery
                </label>
                <select
                  {...register('cash_on_delivery', {
                    required: 'Please select an option',
                  })}
                  defaultValue="yes"
                  className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="w-2/4">
                <label className="block font-semibold text-gray-300 mb-1">
                  Category *
                </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
