interface RouteConfig {
	schema: string;
	authenticate?: boolean;
	authorize?: {
		subject: string;
		action: string;
	};
}

export function routeConfig(config: RouteConfig) {}
