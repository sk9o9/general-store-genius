import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  sku: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minStock: product.min_stock,
        sku: product.sku,
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: productData.name,
            category: productData.category,
            price: productData.price,
            stock: productData.stock,
            min_stock: productData.minStock,
            sku: productData.sku,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        minStock: data.min_stock,
        sku: data.sku,
      };

      setProducts((prev) => [newProduct, ...prev]);
      toast({
        title: "Success",
        description: "Product added successfully",
      });

      return { success: true, product: newProduct };
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      return { success: false, product: null };
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updateData: any = {};
      if (productData.name) updateData.name = productData.name;
      if (productData.category) updateData.category = productData.category;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.stock !== undefined) updateData.stock = productData.stock;
      if (productData.minStock !== undefined) updateData.min_stock = productData.minStock;
      if (productData.sku) updateData.sku = productData.sku;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedProduct: Product = {
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        minStock: data.min_stock,
        sku: data.sku,
      };

      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updatedProduct : product))
      );

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      return { success: true, product: updatedProduct };
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      return { success: false, product: null };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
    lowStockItems: products.filter(product => product.stock <= product.minStock).length,
    monthlyRevenue: 0, // This would be calculated from invoices in a real app
  };

  return {
    products,
    isLoading,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
};