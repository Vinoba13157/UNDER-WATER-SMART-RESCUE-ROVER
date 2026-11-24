import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.aquaguardian.rescue',
  appName: 'AquaGuardian',
  webDir: 'dist',
  backgroundColor: '#f5f8fb',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
