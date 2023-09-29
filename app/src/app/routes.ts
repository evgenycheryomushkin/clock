import { Routes, UrlSegment } from "@angular/router";
import { AppComponent } from "./app.component";
/**
 * Route is parsed and sent to app component. App component
 * send verification event to backend.
 * It is verified on backend and event is sent back.
 * If route is ok then user is allowed to work with UI, otherwise
 * not. So route is important to keept safe to access your tasks.
 * 
 * If route is new backend generates route.
 */
export const routes: Routes = [
    {
      matcher: (url) => {
        if (url.length === 1 && url[0].path.match(RegExp("^([0-9abcdef]{4}|)$","i"))) {
          const path = url[0].path
          return {
            consumed: url,
            posParams: {
              key: new UrlSegment(path, {})
            }
          };
        }
        return null;
      },
      component: AppComponent
    }
  ]; 
  