import { TestBed } from '@angular/core/testing';
import { TopologyService } from './topology';

describe('TopologyService bonus features', () => {
	let topo: TopologyService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		topo = TestBed.inject(TopologyService);
	});

	it('modifies a device name and IP without allowing duplicates', () => {
		topo.addDevice('PC', 100, 100);
		topo.addDevice('Router', 200, 200);
		const [pc, router] = topo.devices();

		expect(topo.updateDevice(pc.id, 'PC aggiornato', router.ip)).toContain('IP');
		expect(topo.updateDevice(pc.id, 'PC aggiornato', '0')).toContain('IPv4');
		expect(topo.updateDevice(pc.id, 'PC aggiornato', 'f')).toContain('IPv4');
		expect(topo.updateDevice(pc.id, 'PC aggiornato', '192.168.1.300')).toContain('IPv4');
		expect(topo.updateDevice(pc.id, '  PC aggiornato  ', '192.0.2.10')).toBeNull();
		expect(topo.devices().find((device) => device.id === pc.id)).toEqual(jasmine.objectContaining({
			name: 'PC aggiornato',
			ip: '192.0.2.10',
		}));
	});

	it('esporta e reimporta la topologia e rifiuta JSON non valido senza alterare lo stato', () => {
		topo.addDevice('PC', 100, 100);
		topo.addDevice('Router', 200, 200);
		const [pc, router] = topo.devices();
		expect(topo.addConnection(pc.id, router.id)).toBeNull();
		const json = topo.exportJSON();

		topo.devices.set([]);
		topo.connections.set([]);
		expect(topo.importJSON(json)).toBeNull();
		expect(topo.devices()).toHaveSize(2);
		expect(topo.connections()).toHaveSize(1);

		const devicesBeforeInvalidImport = topo.devices();
		expect(topo.importJSON('{ non-json }')).toBeTruthy();
		expect(topo.devices()).toEqual(devicesBeforeInvalidImport);
	});
});
