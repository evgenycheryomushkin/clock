import { Routes, UrlSegment } from "@angular/router";
import { AppComponent } from "./app/app.component";

export const routes: Routes = [
    {
      matcher: (url) => {
        if (url.length === 1 && url[0].path.match(RegExp("^([0-9abcdef]{16}|)$","i"))) {
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
  