/* src/lib/appRouter.ts */

import { steps } from '../data/leakFormData'
import type { StepId } from '../types/leakForm'

export type AppRoute =
    | { screen: 'intro' }
    | { screen: 'terms' }
    | { screen: 'workflow'; stepId: StepId }

export function isStepId(value: string): value is StepId {
    return steps.some((step) => step.id === value)
}

export function readRouteFromUrl(): AppRoute {
    const hash = window.location.hash.replace('#', '')

    if (hash === 'terms') {
        return { screen: 'terms' }
    }

    if (isStepId(hash)) {
        return {
            screen: 'workflow',
            stepId: hash,
        }
    }

    return { screen: 'intro' }
}

export function routeToHash(route: AppRoute) {
    if (route.screen === 'terms') return '#terms'
    if (route.screen === 'workflow') return `#${route.stepId}`

    return window.location.pathname
}

export function pushRoute(route: AppRoute) {
    window.history.pushState(route, '', routeToHash(route))
}

export function replaceRoute(route: AppRoute) {
    window.history.replaceState(route, '', routeToHash(route))
}