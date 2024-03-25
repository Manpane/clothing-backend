const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();

const addProduct = async (req, res) => {
    const userId = req.userId;
    const {
      product_name,
      product_price,
      product_description,
      product_images,
      category_id,
    } = req.body;
  
    try {
      const category = await prisma.category.findUnique({
        where: {
          id: category_id,
        },
      });
      if (!category) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Category not found" });
      }
      
      const newProduct = await prisma.product.create({
        data: {
          product_name,
          product_price,
          product_description,
          category_id,
          admin_id: userId,
        },
      });
  
      let images = await Promise.all(product_images.map(url=> {
        return prisma.productImage.create({
          data: {
            url,
            product_id: newProduct.id
          }
        })
      }))
  
      res.status(StatusCodes.CREATED).json({...newProduct, images});
    } catch (error) {
      console.error("Error adding product:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "An error occurred while adding the product" });
    }
  };

  

  
  module.exports = { addProduct };