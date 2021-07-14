import Head from 'next/head'

function Meta() {
   return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta name="viewport" content="width=device-width,initial-scale=1" />

      <meta name='description' content='Take pictures of fruit.' />

      <link href='/favicon.ico' rel='icon' type='image/x-icon' sizes='16x16' />
      <link rel='apple-touch-icon' href='/logo512.png'></link>
      <meta name='theme-color' content='#000000' />

      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />

      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Fruit Camera' />

      <link rel='apple-touch-startup-image' href='/static/images/apple_splash_2048.png' sizes='2048x2732' />
      <link rel='apple-touch-startup-image' href='/static/images/apple_splash_1668.png' sizes='1668x2224' />
      <link rel='apple-touch-startup-image' href='/static/images/apple_splash_1536.png' sizes='1536x2048' />
      <link rel='apple-touch-startup-image' href='/static/images/apple_splash_1125.png' sizes='1125x2436' />
      <link rel='apple-touch-startup-image' href='/static/images/apple_splash_1242.png' sizes='1242x2208' />
      <link rel='apple-touch-startup-image' href='/static/images/apple_splash_750.png' sizes='750x1334' />
      <link rel='apple-touch-startup-image' href='/static/images/apple_splash_640.png' sizes='640x1136' />


      <link rel='manifest' href='/manifest.json' />
      <title>Fruit Camera</title>

    </Head>
  )
}

export default Meta