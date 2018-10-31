import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

declare var ga: Function;

@Injectable({
  providedIn: 'root'
})
export class TrackingServiceService {
  private googleAnalyticsKey = 'UA-128388033-1';

  constructor(public router: Router) {
    this.setup();
    this.trackRouterChanges();

    (<any>window).onerror = (msg, url, line, col, error) => {
      this.trackException(JSON.stringify({msg, url, error}));
    }

  }

  private setup() {
    try {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', '` + this.googleAnalyticsKey + `', 'auto');
      `;
      document.head.appendChild(script);
    } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
    }
  }

  private trackRouterChanges() {
    this.router.events.subscribe(event => {
      try {
        if (typeof ga === 'function') {
          if (event instanceof NavigationEnd) {
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  }


  /**
   * Emit google analytics event
   * Fire event example:
   * this.emitEvent("testCategory", "testAction", "testLabel", 10);
   * @param {string} eventCategory
   * @param {string} eventAction
   * @param {string} eventLabel
   * @param {number} eventValue
   */
  public trackEvent(eventCategory: string,
                    eventAction: string,
                    eventLabel: string = null,
                    eventValue: number = null) {
    if (typeof ga === 'function') {
      ga('send', 'event', {
        eventCategory: eventCategory,
        eventLabel: eventLabel,
        eventAction: eventAction,
        eventValue: eventValue
      });
    }
  }

  public trackException(errMessage) {
    if (typeof ga === 'function') {
      ga('send', 'exception', {
        'exDescription': errMessage,
        'exFatal': false
      });
    }
  }
}
