# Bangoo React Native E-Commerce App - Setup Guide

This is a React Native mobile e-commerce application built with Medusa.js backend integration, designed to match the Bangoo UI designs.

## Features Implemented

### 1. **Splash Screen** ✅
- Purple gradient background with circular decorative elements
- Animated "bangoo" logo with motion trail effect
- Matches the provided UI design perfectly

### 2. **Authentication Screens** ✅
- **Login**: Email/password authentication with "Remember me" checkbox
- **Register**: User registration with Terms agreement
- **Forgot Password**: Email verification for password reset
- **Enter OTP**: 4-digit OTP verification
- **Change Password**: New password creation with validation
- Google OAuth button integration (ready for implementation)

### 3. **Home Screen** ✅
- Search bar with notification icon (red badge indicator)
- Balance card with decorative pattern showing $240,000
- Card number (•••• 4567) and expiry date (12/22)
- Purple circular icon with credit card symbol
- Horizontal scrolling category chips (All, Chair, Sofa, Desk, Living, Bedroom)
- "Popular" section with "See all" link
- 2-column product grid with:
  - Product images from Medusa backend
  - Heart icon for favorites
  - Product title and price in purple ($24.00)

### 4. **Product Screens** ✅
- **Product List**: Vertical list view with larger product cards showing image, title, color, and price
- **Product Grid**: 3-column grid layout (existing in codebase)
- **Product Detail**:
  - Large product image carousel
  - Product title with wishlist heart icon
  - Star rating (4.8) with review count (150 reviews)
  - Product description with "Read more"
  - Quantity selector with +/- buttons
  - Gallery thumbnails
  - "Add to Cart" button in purple
  - Price display

### 5. **Search Screen** ✅
- Search bar with filter icon
- "Recent Searched" section with removable chips:
  - Electronics, Airpods, Nike, Long Shirt
  - Each with X button to remove
- Search results displayed in list format
- Real-time search with Medusa backend integration

### 6. **Additional Screens** ✅
- Checkout flow integrated with Medusa
- Address management
- Payment screens
- Order history and details

## Tech Stack

- **React Native** 0.82.1
- **React** 19.1.1
- **Medusa.js SDK** (@medusajs/js-sdk ^2.11.0)
- **TanStack React Query** for data fetching
- **React Navigation** for routing
- **NativeWind** (TailwindCSS for React Native)
- **React Hook Form** with Zod validation
- **AsyncStorage** for local data persistence

## Project Structure

```
app/
├── api/              # Medusa API client configuration
├── components/       # Reusable UI components
│   ├── common/      # Logo, Button, Input, Text, etc.
│   ├── product/     # Product-specific components
│   └── cart/        # Cart components
├── data/            # Context providers (Cart, Customer, Region, Locale)
├── screens/         # All screen components
│   ├── auth/       # Login, Register, Password screens
│   ├── product/    # Product list, grid, detail
│   └── ...
├── styles/         # Theme configuration and global styles
└── utils/          # Utility functions
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file (already created):
```bash
# For Android Emulator
MEDUSA_BACKEND_URL=http://10.0.2.2:9000

# For iOS Simulator
# MEDUSA_BACKEND_URL=http://localhost:9000

# For Physical Device (use your machine's local IP)
# MEDUSA_BACKEND_URL=http://192.168.1.xxx:9000

PUBLISHABLE_API_KEY=your_medusa_publishable_key
DEFAULT_LOCALE=en-US
```

### 3. Start Medusa Backend

Make sure your Medusa.js backend is running on port 9000:
```bash
cd your-medusa-backend
medusa develop
```

### 4. Run the App

#### Android:
```bash
npm run android
```

#### iOS:
```bash
npm run ios
```

## Medusa Backend Integration

The app is fully integrated with Medusa.js v2 and includes:

### API Client (`app/api/client.tsx`)
- JWT authentication with AsyncStorage
- Automatic token management
- Publishable API key support

### Features Integrated:
1. **Authentication**
   - Customer login/register
   - Token-based session management
   - Password reset flow

2. **Products**
   - Product listing with pagination
   - Product search
   - Product details with variants
   - Category filtering

3. **Cart**
   - Add to cart
   - Update quantities
   - Remove items
   - Cart persistence

4. **Checkout**
   - Address management
   - Shipping options
   - Payment methods
   - Order creation

5. **Customer**
   - Profile management
   - Order history
   - Saved addresses
   - Wishlist

## Color Scheme

The app uses a purple primary color to match the UI designs:
- **Primary Purple**: `#8e6cef`
- **Background**: White
- **Text**: Gray shades (#18181b, #6b7280, etc.)
- **Accent**: Purple for prices, buttons, and active states

## Fonts

- **Display**: Audiowide-Regular
- **Content**: Lato-Regular, Lato-Bold, Lato-Thin

## Next Steps

### Required for Production:
1. **Google OAuth Implementation**: Complete the OAuth flow in login/register screens
2. **Backend Configuration**: Update MEDUSA_BACKEND_URL and PUBLISHABLE_API_KEY in .env
3. **Image Assets**: Add real product images to your Medusa backend
4. **Push Notifications**: Implement notification functionality
5. **Payment Gateway**: Configure payment methods in Medusa
6. **Error Handling**: Add comprehensive error handling and user feedback
7. **Loading States**: Enhance loading indicators throughout the app
8. **Form Validation**: Complete validation messages localization

### Optional Enhancements:
1. **Dark Mode**: The theme system supports dark mode - enable user toggle
2. **Animations**: Add smooth transitions and animations
3. **Analytics**: Integrate analytics tracking
4. **Offline Support**: Add offline functionality with local caching
5. **Push Notifications**: Configure notification system
6. **Deep Linking**: Add deep linking support for products

## Testing

### Test User Flow:
1. Open app → See Splash Screen (2 seconds)
2. Navigate to Login/Register
3. Create account or login
4. Browse products on Home screen
5. Search for products
6. View product details
7. Add to cart
8. Proceed to checkout
9. Complete order

### API Testing:
Ensure your Medusa backend has:
- Sample products with images
- Product categories
- Configured regions and currencies
- Shipping options
- Payment providers

## Troubleshooting

### Cannot connect to backend:
- **Android Emulator**: Use `10.0.2.2` instead of `localhost`
- **iOS Simulator**: Use `localhost` or your machine's IP
- **Physical Device**: Use your machine's IP address on same network

### Images not loading:
- Verify image URLs from Medusa backend
- Check CORS settings on backend
- Ensure images are accessible

### Build Errors:
```bash
# Clean builds
cd android && ./gradlew clean && cd ..
cd ios && rm -rf Pods && pod install && cd ..

# Reset Metro bundler
npm start -- --reset-cache
```

## License

This project is based on the Medusa Mobile React Native starter template.

## Support

For issues related to:
- **Medusa Backend**: Check [Medusa Documentation](https://docs.medusajs.com)
- **React Native**: Check [React Native Documentation](https://reactnative.dev/docs/getting-started)
- **UI Issues**: Reference the `bangooui/` folder for design specifications
