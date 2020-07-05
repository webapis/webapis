const path = require('path')
module.exports = [
  {
    entry: `./client/storybook/index.js`,
    output: {
      filename:  `./client/storybook/build/web.bundle.js`
    },
    resolve: {
      alias: {
        controls: path.resolve(__dirname + '/client/components/controls'),
        features: path.resolve(__dirname + '/client/features') ,
        components:path.resolve(__dirname + '/client/components') ,
        icons: path.resolve(__dirname + '/client/components/icons') ,
        server: path.resolve(__dirname + '/server') 
      }
      },
    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader',options:{ includePaths: [path.join(__dirname, 'node_modules')],} },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.join(__dirname, 'node_modules')],
              implementation: require('dart-sass'),
              fiber: require('fibers'),
            }
          },

        ]
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
      },
            {
               test: /\.(png|svg|jpg|gif)$/,
                use: [
                  'file-loader',
                ],
              },
    ]
    },
  },
];
