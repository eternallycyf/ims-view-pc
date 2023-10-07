import React from 'react';
import { createRoot } from 'react-dom/client';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import ErrorDisplay from './ErrorDisplay';

const vjsComponent = videojs.getComponent('Component');

class vjsErrorDisplay extends vjsComponent {
  constructor(player: VideoJsPlayer, options: VideoJsPlayerOptions) {
    super(player, options);

    /* Bind the current class context to the mount method */
    this.mount = this.mount.bind(this);

    /* When player is ready, call method to mount React component */
    player.ready(() => {
      this.mount();
    });

    /* Remove React root when component is destroyed */
    this.on('dispose', () => {
      const root = createRoot(this.el());
      root.unmount();
    });
  }

  /**
   * We will render out the React EpisodeList component into the DOM element
   * generated automatically by the VideoJS createEl() method.
   *
   * We fetch that generated element using `this.el()`, a method provided by the
   * vjsComponent class that this class is extending.
   */
  mount() {
    const el = this.el();
    el.className = 'vjs-customer-error-display';
    createRoot(el).render(<ErrorDisplay vjsComponent={this} />);
  }
}

/**
 * Make sure to register the vjsComponent so Video JS knows it exists
 */
vjsComponent.registerComponent('vjsErrorDisplay', vjsErrorDisplay);

export default vjsErrorDisplay;
