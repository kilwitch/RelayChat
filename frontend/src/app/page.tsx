import FeatureSection from "@/components/ui/base/FeatureSection";
import Footer from "@/components/ui/base/Footer";
import HeroSection from "@/components/ui/base/HeroSection";
import Navbar from "@/components/ui/base/NavBar";
import UserReviews from "@/components/ui/base/UserReviews";
import { getServerSession } from "next-auth";
import { CustomSession } from "./api/auth/[...nextauth]/options";


export default async function Home() {
  const session:CustomSession |null = await getServerSession(authOptions)
  return (
     <div className="min-h-screen flex flex-col ">
      {/* Header */}
      <Navbar user= {session?.user} />
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* User Reviews Section */}
      <UserReviews />

      {/* Footer */}
      <Footer />
    </div>
  );
}
