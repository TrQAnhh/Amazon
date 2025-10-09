import { DiscountType, ErrorCode, UserTicketStatus } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { RepositoryService } from '@repository/repository.service';

export async function applyDiscountTicket(
  repository: RepositoryService,
  userId: number,
  discountId: number,
  totalAmount: number,
) {
  const ticket = await repository.userTicket.findTicket(userId, discountId);
  if (!ticket) throw new RpcException(ErrorCode.TICKET_NOT_FOUND);

  const ticketInfo = ticket.ticket;
  let discountAmount = 0;

  if (totalAmount < Number(ticketInfo.minOrderAmount)) {
    throw new RpcException(ErrorCode.MIN_ORDER_AMOUNT_NOT_REACHED);
  }

  if (ticketInfo.type === DiscountType.PERCENT) {
    discountAmount = Math.min((totalAmount * Number(ticketInfo.value)) / 100, Number(ticketInfo.maxDiscount));
  } else {
    discountAmount = Number(ticketInfo.value);
  }

  discountAmount = Math.min(discountAmount, totalAmount);
  const finalAmount = totalAmount - discountAmount;

  ticket.quantity -= 1;
  ticketInfo.total -= 1;
  if (ticket.quantity <= 0) {
    ticket.status = UserTicketStatus.USED;
  }

  await repository.userTicket.save(ticket);
  await repository.discountTicket.save(ticketInfo);

  return { finalAmount, discountAmount, ticket };
}
