import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SimplicateService} from './simplicate.service';

declare var ga: Function;

@Injectable({
  providedIn: 'root'
})
export class TrackingServiceService {

  constructor(public router: Router, simplicate: SimplicateService) {
    this.trackRouterChanges();
    this.trackDimension('dimension1', simplicate.employee.id);
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
      // tslint:disable-next-line
      console.info('send', 'event', {
        eventCategory: eventCategory,
        eventLabel: eventLabel,
        eventAction: eventAction,
        eventValue: eventValue
      });

      // tslint:disable-next-line
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

      // tslint:disable-next-line
      console.info('send', 'exception', {
        'exDescription': errMessage,
        'exFatal': false
      });

      ga('send', 'exception', {
        'exDescription': errMessage,
        'exFatal': false
      });
    }
  }

  public trackDimension(dimension, value) {
    if (typeof ga === 'function') {
      // tslint:disable-next-line
      console.info('send', 'dimension', {
        'dimension': dimension,
        'value': value
      });

      ga('set', dimension, value);
    }
  }
}
