import { Routes, UrlSegment } from "@angular/router";
import { AppComponent } from "./app.component";
/**
 * Route is parsed and sent to app component. App component
 * send verification event to backend.
 * It is verified on backend and event is sent back.
 * If route is ok then user is allowed to work with UI, otherwise
 * not. So route is important to keep safe to access your tasks.
 *
 * If route is new backend generates route.
 */
export const routes: Routes = [
    {
      matcher: (url) => {
        console.log("url", url)
        if (url.length === 1) {
          const path = url[0].path;
          if (path.match(RegExp("^([0-9abcdef]{8}|)$","i"))) {
              const key = url[0].path
            console.log("key", key)
            return {
              consumed: url,
              posParams: {
                key: new UrlSegment(key, {})
              }
            };
          }
        }
        return null;
      },
      component: AppComponent
    }
  ];
