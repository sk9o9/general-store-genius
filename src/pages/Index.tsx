import { useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { StatsCards } from "@/components/Dashboard/StatsCards";
import { ProductTable } from "@/components/Inventory/ProductTable";
import { InvoiceGenerator } from "@/components/Invoice/InvoiceGenerator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockProducts, mockStats } from "@/data/mockData";
import { Product } from "@/components/Inventory/ProductTable";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const { toast } = useToast();

  const handleEditProduct = (product: Product) => {
    toast({
      title: "Edit Product",
      description: `Opening edit form for ${product.name}`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: `${product.name} has been removed from inventory`,
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
    toast({
      title: "Add Product",
      description: "Opening new product form",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
              <p className="text-muted-foreground">
                Overview of your store's inventory and performance
              </p>
            </div>
            <StatsCards {...mockStats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Recent Activity
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Added</span>
                    <span className="text-foreground">Premium Rice 5kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock Updated</span>
                    <span className="text-foreground">Olive Oil 500ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Generated</span>
                    <span className="text-foreground">#INV-001</span>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Low Stock Alerts
                </h3>
                <div className="space-y-3 text-sm">
                  {products.filter(p => p.stock <= p.minStock).map(product => (
                    <div key={product.id} className="flex justify-between">
                      <span className="text-muted-foreground">{product.name}</span>
                      <span className="text-warning font-medium">{product.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h2>
                <p className="text-muted-foreground">
                  Manage your store's products and stock levels
                </p>
              </div>
              <Button onClick={handleAddProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
            <ProductTable
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        );
      case "invoices":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Invoice Generation</h2>
              <p className="text-muted-foreground">
                Create and manage customer invoices
              </p>
            </div>
            <InvoiceGenerator products={products} />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <p className="text-muted-foreground">
                This section is coming soon!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;