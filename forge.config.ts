import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerAppImage } from '@reforged/maker-appimage';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerZIP } from '@electron-forge/maker-zip';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        extraResource: './local-resources',
    },
    rebuildConfig: {},
    makers: [
        new MakerDeb({
            options: {
                categories: ['AudioVideo', 'Audio', 'Video'],
                icon: 'resources/icon.png',
                desktopTemplate: 'resources/cloudmusic.desktop',
            }
        }),
        new MakerAppImage({
            options: {
                categories: ['AudioVideo', 'Audio', 'Video'],
                icon: 'resources/icon.png',
                desktopFile: 'resources/cloudmusic.desktop',
            }
        }),
        new MakerZIP({})
    ],
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: {
                        'main': 'src/main/index.ts',
                    },
                    config: 'vite.main.config.ts',
                    target: 'main',
                },
                {
                    entry: {
                        'inject-cloudmusic': 'src/inject/index.ts',
                    },
                    config: 'vite.main.config.ts',
                    target: 'main',
                },
                {
                    entry: {
                        'inject-login': 'src/inject/login.ts',
                    },
                    config: 'vite.main.config.ts',
                    target: 'main',
                },
                {
                    entry: {
                        'preload-app': 'src/preload/app.ts',
                    },
                    config: 'vite.preload.config.ts',
                    target: 'preload',
                },
                {
                    entry: {
                        'preload-cloudmusic': 'src/preload/cloudmusic.ts',
                    },
                    config: 'vite.preload.config.ts',
                    target: 'preload',
                },
            ],
            renderer: [
                {
                    name: 'main_window',
                    config: 'vite.renderer.config.ts',
                },
            ],
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
