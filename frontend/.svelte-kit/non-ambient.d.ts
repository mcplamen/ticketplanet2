
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/create-event" | "/dashboard" | "/events" | "/events/create" | "/events/[id]" | "/login" | "/register" | "/tickets" | "/tickets/validate" | "/tickets/validate/[ticketId]";
		RouteParams(): {
			"/events/[id]": { id: string };
			"/tickets/validate/[ticketId]": { ticketId: string }
		};
		LayoutParams(): {
			"/": { id?: string; ticketId?: string };
			"/create-event": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/events": { id?: string };
			"/events/create": Record<string, never>;
			"/events/[id]": { id: string };
			"/login": Record<string, never>;
			"/register": Record<string, never>;
			"/tickets": { ticketId?: string };
			"/tickets/validate": { ticketId?: string };
			"/tickets/validate/[ticketId]": { ticketId: string }
		};
		Pathname(): "/" | "/create-event" | "/create-event/" | "/dashboard" | "/dashboard/" | "/events" | "/events/" | "/events/create" | "/events/create/" | `/events/${string}` & {} | `/events/${string}/` & {} | "/login" | "/login/" | "/register" | "/register/" | "/tickets" | "/tickets/" | "/tickets/validate" | "/tickets/validate/" | `/tickets/validate/${string}` & {} | `/tickets/validate/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}