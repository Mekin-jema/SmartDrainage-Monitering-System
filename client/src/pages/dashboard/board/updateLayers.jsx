import { broom as Broom } from '@lucide/lab';
import { CheckCircle, AlertCircle, AlertTriangle, Wrench, HelpCircle, Lock, LockOpen, ArrowRight } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Cache for loaded images to prevent duplicate loading
const imageCache = new Map();

const svgToImageBitmap = async (IconComponent, color = 'black', size = 32) => {
    const cacheKey = `${IconComponent.name}-${color}-${size}`;

    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }

    try {
        const svgMarkup = renderToStaticMarkup(
            <IconComponent color={color} width={size} height={size} strokeWidth={1.5} />
        );
        const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
        const imageBitmap = await createImageBitmap(await blob.arrayBuffer());
        imageCache.set(cacheKey, imageBitmap);
        return imageBitmap;
    } catch (error) {
        console.error('Error converting SVG to ImageBitmap:', error);
        throw error;
    }
};

const statusToIcon = {
    'functional': { icon: CheckCircle, color: 'green' },
    'damaged': { icon: AlertCircle, color: 'red' },
    'overflowing': { icon: AlertTriangle, color: 'purple' },
    'under_maintenance': { icon: Wrench, color: 'orange' },
    'needs_cleaning': { icon: Broom, color: 'gold' },
    'default': { icon: HelpCircle, color: 'gray' }
};

const coverStatusToIcon = {
    'open': { icon: LockOpen, color: 'red' },
    'closed': { icon: Lock, color: 'green' },
    'damaged': { icon: AlertCircle, color: 'orange' }
};

const updateLayers = async (map, manholes, pipes) => {
    if (!map || !manholes || !pipes) {
        console.error('Missing required parameters');
        return;
    }

    try {
        // Remove existing layers and sources
        const layersToRemove = [
            'manholes-status-icon', 'manholes-cover-status', 'manholes-code-label',
            'pipes-line', 'pipes-arrows', 'pipes-blocked-highlight',
            'manholes-popup-highlight', 'pipes-flow-direction'
        ];

        layersToRemove.forEach(layer => {
            if (map.getLayer(layer)) {
                map.removeLayer(layer);
            }
        });

        if (map.getSource('manholes')) {
            map.removeSource('manholes');
        }
        if (map.getSource('pipes')) {
            map.removeSource('pipes');
        }

        // Process pipe data
        const pipeFeatures = pipes.map(pipe => {
            const start = manholes.find(m => m.id === pipe.start);
            const end = manholes.find(m => m.id === pipe.end);
            if (!start || !end) return null;

            const dx = end.location[0] - start.location[0];
            const dy = end.location[1] - start.location[1];
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            const midPoint = [start.location[0] + dx * 0.5, start.location[1] + dy * 0.5];
            const quarterPoint = [start.location[0] + dx * 0.25, start.location[1] + dy * 0.25];
            const threeQuarterPoint = [start.location[0] + dx * 0.75, start.location[1] + dy * 0.75];

            return {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [start.location, end.location]
                },
                properties: {
                    id: pipe.id,
                    blockage: pipe.blockage,
                    start: pipe.start,
                    end: pipe.end,
                    angle,
                    flowDirection: pipe.flowDirection || 'start_to_end',
                    midPoint,
                    quarterPoint,
                    threeQuarterPoint
                }
            };
        }).filter(Boolean);

        // Add pipe source
        map.addSource('pipes', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: pipeFeatures
            }
        });

        // Add pipe visualization layers
        map.addLayer({
            id: 'pipes-line',
            type: 'line',
            source: 'pipes',
            paint: {
                'line-color': [
                    'case',
                    ['==', ['get', 'blockage'], 'blocked'], 'red',
                    ['==', ['get', 'blockage'], 'partial'], 'orange',
                    'blue'
                ],
                'line-width': 3,
                'line-opacity': 0.8
            }
        });

        // Add manhole features
        const manholeFeatures = manholes.map(m => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: m.location
            },
            properties: { ...m }
        }));

        map.addSource('manholes', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: manholeFeatures
            }
        });

        // Preload all required icons
        const iconPromises = [];

        // Preload status icons
        manholes.forEach(manhole => {
            const status = manhole.status || 'default';
            const statusDef = statusToIcon[status] || statusToIcon['default'];
            const statusIconId = `status-${manhole.id}`;

            if (!map.hasImage(statusIconId)) {
                iconPromises.push(
                    svgToImageBitmap(statusDef.icon, statusDef.color, 32)
                        .then(image => map.addImage(statusIconId, image))
                        .catch(err => console.error('Error loading status icon:', err))
                );
            }

            const coverStatus = manhole.cover_status || 'closed';
            const coverDef = coverStatusToIcon[coverStatus] || coverStatusToIcon['closed'];
            const coverIconId = `cover-${manhole.id}`;

            if (!map.hasImage(coverIconId)) {
                iconPromises.push(
                    svgToImageBitmap(coverDef.icon, coverDef.color, 20)
                        .then(image => map.addImage(coverIconId, image))
                        .catch(err => console.error('Error loading cover icon:', err))
                );
            }
        });

        // Preload flow arrow icon
        if (!map.hasImage('flow-arrow')) {
            iconPromises.push(
                svgToImageBitmap(ArrowRight, 'blue', 20)
                    .then(image => map.addImage('flow-arrow', image))
                    .catch(err => console.error('Error loading flow arrow:', err))
            );
        }

        // Wait for all icons to load
        await Promise.all(iconPromises);

        // Add manhole visualization layers
        map.addLayer({
            id: 'manholes-status-icon',
            type: 'symbol',
            source: 'manholes',
            layout: {
                'icon-image': ['concat', 'status-', ['get', 'id']],
                'icon-size': 1,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        });

        map.addLayer({
            id: 'manholes-cover-status',
            type: 'symbol',
            source: 'manholes',
            layout: {
                'icon-image': ['concat', 'cover-', ['get', 'id']],
                'icon-size': 0.6,
                'icon-offset': [0, -0.8],
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        });

        map.addLayer({
            id: 'manholes-code-label',
            type: 'symbol',
            source: 'manholes',
            layout: {
                'text-field': ['get', 'code'],
                'text-size': 10,
                'text-offset': [0, 1.5],
                'text-anchor': 'top',
                'text-optional': true
            },
            paint: {
                'text-color': '#000',
                'text-halo-color': 'white',
                'text-halo-width': 1
            }
        });

        // Add flow direction indicators
        map.addLayer({
            id: 'pipes-flow-direction',
            type: 'symbol',
            source: 'pipes',
            layout: {
                'icon-image': 'flow-arrow',
                'icon-size': 0.8,
                'icon-rotate': ['get', 'angle'],
                'icon-allow-overlap': true,
                'symbol-placement': 'line-center'
            }
        });

        // Add interactive highlights
        map.addLayer({
            id: 'manholes-popup-highlight',
            type: 'circle',
            source: 'manholes',
            paint: {
                'circle-radius': 20,
                'circle-color': 'transparent',
                'circle-stroke-color': '#00FFFF',
                'circle-stroke-width': 2,
                'circle-opacity': 0
            },
            filter: ['==', 'id', '']
        });

        // Add click interaction
        map.on('click', 'manholes-status-icon', (e) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                map.setFilter('manholes-popup-highlight', ['==', 'id', feature.properties.id]);
                map.setPaintProperty('manholes-popup-highlight', 'circle-opacity', 0.7);

                // You can add your popup logic here
            }
        });

        // Change cursor when hovering over manholes
        map.on('mouseenter', 'manholes-status-icon', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'manholes-status-icon', () => {
            map.getCanvas().style.cursor = '';
        });

    } catch (error) {
        console.error('Error updating layers:', error);
    }
};

export default updateLayers;