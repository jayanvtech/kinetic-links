#!/bin/bash

echo "🚀 Setting up Kinetic Links - Premium Linktree Clone"
echo "=================================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the development server
echo "🌟 Starting development server..."
echo "✨ Your enhanced Linktree clone will be available at:"
echo "   🔗 Local: http://localhost:8080"
echo "   🌐 Network: Available on your local network"
echo ""
echo "🎯 Features included in this premium version:"
echo "   ✅ Modern glass morphism design"
echo "   ✅ Animated gradients and floating elements"
echo "   ✅ QR Code generation for sharing"
echo "   ✅ Advanced analytics dashboard"
echo "   ✅ Social media icons and integration"
echo "   ✅ Multiple theme options"
echo "   ✅ Enhanced user experience"
echo "   ✅ Mobile-responsive design"
echo "   ✅ Supabase backend integration"
echo ""
echo "🔧 To set up the database:"
echo "   1. Create a Supabase project"
echo "   2. Update src/integrations/supabase/client.ts with your URL and key"
echo "   3. Run the migrations in supabase/migrations/"
echo ""
echo "🎉 Starting the server now..."

npm run dev
