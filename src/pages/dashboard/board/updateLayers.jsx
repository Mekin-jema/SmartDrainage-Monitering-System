// Assuming you are using @lucide/react for icons and bundling them into your app as custom images
// You must preload all icons you want to use before adding layers
// Example imports
import { CheckCircle, AlertCircle, AlertTriangle, Wrench, Broom, HelpCircle, Lock, LockOpen, ArrowRight } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

const svgToImageBitmap = async (IconComponent, color = 'black', size = 32) => {
    const svgMarkup = renderToStaticMarkup(
        <IconComponent color={color} width={size} height={size} strokeWidth={1.5} />
    );
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const imageBitmap = await createImageBitmap(await blob.arrayBuffer());
    return imageBitmap;
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
    const layersToRemove = [
        'manholes-status-icon', 'manholes-cover-status', 'manholes-code-label',
        'pipes-line', 'pipes-arrows', 'pipes-blocked-highlight',
        'manholes-popup-highlight', 'pipes-flow-direction'
    ];

    layersToRemove.forEach(layer => map.getLayer(layer) && map.removeLayer(layer));
    map.getSource('manholes') && map.removeSource('manholes');
    map.getSource('pipes') && map.removeSource('pipes');

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
            geometry: { type: 'LineString', coordinates: [start.location, end.location] },
            properties: { id: pipe.id, blockage: pipe.blockage, start: pipe.start, end: pipe.end, angle, flowDirection: pipe.flowDirection || 'start_to_end', midPoint, quarterPoint, threeQuarterPoint }
        };
    }).filter(Boolean);

    map.addSource('pipes', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: pipeFeatures }
    });

    const manholeFeatures = manholes.map(m => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: m.location },
        properties: { ...m }
    }));

    map.addSource('manholes', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: manholeFeatures }
    });

    // Preload icons
    for (const manhole of manholes) {
        const status = manhole.status || 'default';
        const statusDef = statusToIcon[status] || statusToIcon['default'];
        const statusIconId = `status-${manhole.id}`;

        if (!map.hasImage(statusIconId)) {
            const image = await svgToImageBitmap(statusDef.icon, statusDef.color, 32);
            map.addImage(statusIconId, image);
        }

        const coverStatus = manhole.cover_status || 'closed';
        const coverDef = coverStatusToIcon[coverStatus] || coverStatusToIcon['closed'];
        const coverIconId = `cover-${manhole.id}`;

        if (!map.hasImage(coverIconId)) {
            const image = await svgToImageBitmap(coverDef.icon, coverDef.color, 20);
            map.addImage(coverIconId, image);
        }
    }

    if (!map.hasImage('flow-arrow')) {
        const image = await svgToImageBitmap(ArrowRight, 'blue', 20);
        map.addImage('flow-arrow', image);
    }

    // Add layers
    map.addLayer({
        id: 'manholes-status-icon',
        type: 'symbol',
        source: 'manholes',
        layout: {
            'icon-image': ['concat', 'status-', ['get', 'id']],
            'icon-size': 1,
            'icon-allow-overlap': true
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
            'icon-allow-overlap': true
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
            'text-anchor': 'top'
        },
        paint: {
            'text-color': '#000'
        }
    });
};

export default updateLayers;
