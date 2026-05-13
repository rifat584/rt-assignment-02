import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

const router: Router = Router();

// This routes connects all other module routes together
const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  // {
  //   path: 'hotel',
  //   route: HotelRoutes,
  // },
];

routes.forEach((route) => router.use(route.path, route.route));
export default router;
