import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeSiteConfig = async () => {
    try {
        const exsitingConfig = await prisma.site_config.findFirst();
        if (!exsitingConfig) {
            await prisma.site_config.create({
                data: {
                    categories: [
                        "Electronics",
                        "Fashion",
                        "Home & Garden",
                        "Sports & Outdoors",
                    ],
                    subCategories: {
                        "Electronics": ["Mobile Phones", "Laptops", "Cameras"],
                        "Fashion": ["Men's Clothing", "Women's Clothing", "Accessories"],
                        "Home & Garden": ["Furniture", "Kitchen", "Decor"],
                        "Sports & Outdoors": ["Fitness Equipment", "Outdoor Gear", "Sportswear"],
                    },
                }
            })
        }
    } catch (error) {
        console.error('Error initializing site config:', error);
    }
}