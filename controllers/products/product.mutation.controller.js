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

  const updateProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const userId = req.userId;
    const {
      product_name,
      product_price,
      product_description,
      category_id,
    } = req.body;
  
    try {
      if (category_id){
        const category = await prisma.category.findUnique({
          where: {
            id: parseInt(category_id),
          },
        });
        if (!category) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Category not found" });
        }
      }
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Product not found" });
      }
      if (product.admin_id !== userId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "You are unauthorized" });
      }
      const updatedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          product_name,
          product_price,
          product_description,
          category_id,
        },
      });
  
      return res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "An error occurred while updating the product" });
    }
  };

  const deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const userId = req.userId;
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Product not found" });
      }
      if (!(product.admin_id === userId)) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "You are unauthorized" });
      }
      await prisma.productImage.deleteMany({
        where: {
          product_id: productId
        }
      })
      await prisma.cartItem.deleteMany({
        where: {
          product_id: productId
        }
      });
      await prisma.wishlistItem.deleteMany({
        where: {
          product_id: productId
        }
      });
      await prisma.review.deleteMany({
        where: {
          product_id: productId
        }
      });
      const orderedProduct = await prisma.orderItem.findMany({
        where: {
          product_id: productId
        }
      });
      if (orderedProduct.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Product is in an order" });
      }
      const deletedProduct = await prisma.product.delete({
        where: {
          id: productId,
        },
      });
      res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "Product Deleted Successfully", deletedProduct });
    } catch (error) {
      console.error("Error deleting product:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "An error occurred while deleting the product" });
    }
  };


  module.exports = { addProduct, updateProduct, deleteProduct };