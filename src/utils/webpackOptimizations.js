// Bundle optimization utilities for production builds
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// Webpack optimization configuration
export const createOptimizedWebpackConfig = (config, { buildId, dev, isServer, webpack }) => {
  // Only apply optimizations for client-side bundles
  if (isServer) return config;

  // Bundle analyzer for development and analysis
  if (dev && process.env.ANALYZE === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: true,
        analyzerPort: 8888,
      })
    );
  }

  // Production bundle analyzer
  if (!dev && process.env.ANALYZE === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../bundle-analyzer-report.html',
        openAnalyzer: false,
      })
    );
  }

  // Advanced chunk splitting strategy
  config.optimization.splitChunks = {
    chunks: 'all',
    minSize: 20000,
    minRemainingSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    enforceSizeThreshold: 50000,
    cacheGroups: {
      // Framework chunk (React, Next.js)
      framework: {
        test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
        name: 'framework',
        priority: 40,
        chunks: 'all',
        enforce: true,
        reuseExistingChunk: true,
      },
      
      // Firebase chunk
      firebase: {
        test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
        name: 'firebase',
        priority: 35,
        chunks: 'all',
        reuseExistingChunk: true,
      },
      
      // Editor chunk (CKEditor)
      editor: {
        test: /[\\/]node_modules[\\/](@ckeditor|ckeditor5)[\\/]/,
        name: 'editor',
        priority: 30,
        chunks: 'all',
        reuseExistingChunk: true,
      },
      
      // Icons chunk
      icons: {
        test: /[\\/]node_modules[\\/]react-icons[\\/]/,
        name: 'icons',
        priority: 25,
        chunks: 'all',
        reuseExistingChunk: true,
      },
      
      // Utility libraries
      lib: {
        test: /[\\/]node_modules[\\/](lodash|date-fns|clsx|classnames)[\\/]/,
        name: 'lib',
        priority: 20,
        chunks: 'all',
        reuseExistingChunk: true,
      },
      
      // CMS components
      cms: {
        test: /[\\/]src[\\/](cms|components[\\/]cms)[\\/]/,
        name: 'cms',
        priority: 15,
        chunks: 'all',
        reuseExistingChunk: true,
        minChunks: 2,
      },
      
      // Testing components (only in development)
      ...(dev && {
        testing: {
          test: /[\\/]src[\\/]components[\\/]testing[\\/]/,
          name: 'testing',
          priority: 15,
          chunks: 'all',
          reuseExistingChunk: true,
        },
      }),
      
      // Common vendor chunk
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        priority: 10,
        chunks: 'all',
        reuseExistingChunk: true,
        minChunks: 2,
      },
      
      // Common components
      common: {
        test: /[\\/]src[\\/](components|hooks|utils)[\\/]/,
        name: 'common',
        priority: 5,
        chunks: 'all',
        reuseExistingChunk: true,
        minChunks: 2,
      },
    },
  };

  // Additional optimizations
  config.optimization = {
    ...config.optimization,
    usedExports: true,
    sideEffects: false,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    
    // Runtime chunk for better caching
    runtimeChunk: {
      name: 'runtime',
    },
  };

  // Resolve alias optimizations
  config.resolve.alias = {
    ...config.resolve.alias,
    // Optimize react-icons imports
    'react-icons/fi': 'react-icons/fi/index.esm.js',
    'react-icons/fa': 'react-icons/fa/index.esm.js',
  };

  // Module federation for micro-frontends (future)
  if (process.env.ENABLE_MODULE_FEDERATION === 'true') {
    const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
    config.plugins.push(
      new ModuleFederationPlugin({
        name: 'cms',
        filename: 'remoteEntry.js',
        exposes: {
          './BlogEditor': './src/cms/components/BlogEdit',
          './BlogList': './src/cms/components/BlogList',
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          next: { singleton: true },
        },
      })
    );
  }

  return config;
};

// Performance budget configuration
export const performanceBudgets = {
  maxAssetSize: 250000, // 250KB
  maxEntrypointSize: 400000, // 400KB
  hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  assetFilter: (assetFilename) => {
    // Only check JS and CSS files
    return /\.(js|css)$/.test(assetFilename);
  },
};

// Bundle size analysis configuration
export const bundleSizeConfig = {
  files: [
    {
      path: '.next/static/chunks/pages/*.js',
      maxSize: '250 KB',
      compression: 'gzip',
    },
    {
      path: '.next/static/chunks/framework*.js',
      maxSize: '200 KB',
      compression: 'gzip',
    },
    {
      path: '.next/static/chunks/vendor*.js',
      maxSize: '150 KB',
      compression: 'gzip',
    },
    {
      path: '.next/static/chunks/cms*.js',
      maxSize: '100 KB',
      compression: 'gzip',
    },
    {
      path: '.next/static/css/*.css',
      maxSize: '50 KB',
      compression: 'gzip',
    },
  ],
};

// Tree shaking configuration for specific libraries
export const treeShakingConfig = {
  // Lodash tree shaking
  lodash: {
    babel: {
      plugins: [
        ['lodash', { id: ['lodash'] }],
      ],
    },
  },
  
  // React Icons tree shaking
  reactIcons: {
    babel: {
      plugins: [
        ['import', {
          libraryName: 'react-icons',
          libraryDirectory: '',
          camel2DashComponentName: false,
        }, 'react-icons'],
      ],
    },
  },
  
  // Date-fns tree shaking (if we replace moment)
  dateFns: {
    babel: {
      plugins: [
        ['date-fns', {
          useESModules: true,
        }],
      ],
    },
  },
};

export default {
  createOptimizedWebpackConfig,
  performanceBudgets,
  bundleSizeConfig,
  treeShakingConfig,
};