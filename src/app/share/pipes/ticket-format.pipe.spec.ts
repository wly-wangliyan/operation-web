import { TicketFormatPipe } from './ticket-format.pipe';

describe('TicketFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new TicketFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
