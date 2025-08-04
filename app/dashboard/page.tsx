"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import OrderHistory from "@/components/dashboard/OrderHistory";
import ReviewManagement from "@/components/dashboard/ReviewManagement";
import PricingSummary from "@/components/dashboard/PricingSummary";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import Downloads from "@/components/dashboard/Downloads";

export default function BuyerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login/buyer");
    } else if (status === "authenticated" && session?.user?.role !== "BUYER") {
      router.push("/login/buyer");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "BUYER") {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <OrderHistory />
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                <ReviewManagement />
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Pricing Summary</h3>
                <PricingSummary customerId={session.user.customerId || ""} />
              </div>
            </div>
          </div>
        );
      case "orders":
        return <OrderHistory />;
      case "reviews":
        return <ReviewManagement />;
      case "pricing":
        return <PricingSummary customerId={session.user.customerId || ""} />;
      case "notifications":
        return <NotificationCenter customerId={session.user.customerId || ""} />;
      case "downloads":
        return <Downloads />;
      default:
        return <OrderHistory />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
