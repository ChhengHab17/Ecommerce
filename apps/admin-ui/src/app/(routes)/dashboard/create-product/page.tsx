'use client';
import ImagePlaceHolder from 'apps/admin-ui/src/shared/components/image-placeholder';
import { ChevronRight } from 'lucide-react';
import Input from 'packages/components/input';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ColorSelector from 'packages/components/color-selector';
import CustomSpecifications from 'packages/components/custom-specification-selector';
import CustomProperties from 'packages/components/custom-properties';
import { useQuery } from 'node_modules/@tanstack/react-query/build/modern/useQuery';
import axiosInstance from 'apps/admin-ui/src/utils/axoisInstance';
import RichTextEditor from 'packages/components/RichTextEditor';
import { SizeSelector } from 'packages/components/size-selector';

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
  const [isChanged, setIsChanged] = useState(true);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/product/api/getCategories');
        const data = await response.data;
        return data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch('category');
  const regularPrice = watch('regular_price');
  const subcategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  console.log(categories, subCategoriesData);

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
  const handleSaveDraft = () => {};

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
              {isLoading ? (
                <p className="text-gray-400"> loading Categories...</p>
              ) : isError ? (
                <p className="text-red-500">Error loading Categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Please select a category' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {' '}
                      <option value="">Select a category</option>
                      {categories.map((category: any) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Sub Category *
                </label>
                <Controller
                  name="subCategory"
                  control={control}
                  rules={{ required: 'Please select a sub category' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a sub category</option>
                      {subcategories.map((subCategory: string) => (
                        <option
                          key={subCategory}
                          value={subCategory}
                          className="bg-black"
                        >
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.subCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subCategory.message as string}
                  </p>
                )}

                <div className="mt-2">
                  <label className="block font-semibold text-gray-300 mb-1">
                    Detailed Description *(At least 50 words)
                  </label>
                  <Controller
                    name="detailed_description"
                    control={control}
                    rules={{
                      required: 'Detailed description is required',
                      validate: (value) => {
                        const wordCount = value
                          ?.split(/\s+/)
                          .filter((word: string) => word.length).length;
                        return (
                          wordCount >= 50 ||
                          'Detailed description must be 50 words or more'
                        );
                      },
                    }}

                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="mt-2">
                  <Input
                    label="Video URL"
                    placeholder="https://www.youtube.com/embed/xyz123"
                    {...register('video_url', {
                      required: 'Video URL is required',
                      pattern: {
                        value:
                          /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/[a-zA-Z0-9_-]+)$/,
                        message:
                          'Please enter a valid URL use format: https://www.youtube.com/embed/VIDEO_ID',
                      },
                    })}
                  />
                  {errors.video_url && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.video_url.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Regular Price *"
                    placeholder="10$"
                    type="number"
                    {...register('regular_price', {
                      required: 'Regular price is required',
                      min: {
                        value: 1,
                        message: 'Regular price must be at least 1',
                      },
                      validate: (value) =>
                        !isNaN(value) || 'Regular price must be a number',
                    })}
                  />
                  {errors.regular_price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.regular_price.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Sale Price *"
                    placeholder="8$"
                    type="number"
                    {...register('sale_price', {
                      required: 'Sale price is required',
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: 'Sale price must be at least 1',
                      },
                      validate: (value) => {
                        if (isNaN(value)) {
                          return 'Sale price must be a number';
                        }
                        if (regularPrice && value > regularPrice) {
                          return 'Sale price must be less than or equal to regular price';
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.sale_price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sale_price.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Stock *"
                    placeholder="100"
                    type="number"
                    {...register('stock', {
                      required: 'Stock is required',
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: 'Stock must be at least 1',
                      },
                      max: {
                        value: 10000,
                        message: 'Stock must be less than or equal to 10000',
                      },
                      validate: (value) => {
                        if (isNaN(value)) {
                          return 'Stock must be a number';
                        }
                        if (!Number.isInteger(value)) {
                          return 'Stock must be a whole number';
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.stock.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <SizeSelector control={control} errors={errors} />
                </div>
                <div className="mt-4">
                  <label className="block font-semibold text-gray-300 mb-1">
                    Discount Code (Optional)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default Page;
