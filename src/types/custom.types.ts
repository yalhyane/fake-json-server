import { randStreetAddress, randStreetName } from '@ngneat/falso';

export const street = () => `${randStreetName()} ${randStreetAddress()}`;
