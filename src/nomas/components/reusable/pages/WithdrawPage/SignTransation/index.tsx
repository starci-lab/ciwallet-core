import {
  NomasNumberTransparentInput,
  SelectChainTab,
} from '@/nomas/components/styled';
import {
  NomasAvatar,
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasCardHeader,
  NomasDivider,
  NomasTooltip,
} from '../../../../extends';
import {
  useAppSelector,
  useAppDispatch,
  setWithdrawChainId,
  SwapPageState,
  setSwapPage,
} from '@/nomas/redux';
import { useBalance } from '@ciwallet-sdk/hooks';
import { ButtonSelectTokenWithdraw } from '../ButtonSelectTokenWithdraw';
import { ClipboardIcon, GearIcon, InfoIcon } from '@phosphor-icons/react';
import { Input, Snippet, Textarea } from '@heroui/react';
import { useSwapFormik } from '@/nomas/hooks/singleton/formiks/useSwapFormik';

export const SignTransaction = () => {
  const dispatch = useAppDispatch();
  const chainManager = useAppSelector((state) => state.chain.manager);
  const withdrawChainId = useAppSelector((state) => state.withdraw.chainId);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const swapFormik = useSwapFormik();
  const { handle } = useBalance();
  const network = useAppSelector((state) => state.base.network);
  const tokenInEntity = tokenManager.getTokenById(swapFormik.values.tokenIn);
  const tokenOutEntity = tokenManager.getTokenById(swapFormik.values.tokenOut);
  const tokenOutChainMetadata = chainManager.getChainById(
    swapFormik.values.tokenOutChainId,
  );
  return (
    <>
      <NomasCard className=" bg-emerald-400">
        <NomasCardBody>
          <div className="flex flex-col justify-between items-center">
            <NomasAvatar className="w-20 h-20 text-large" src="" />
            <span className="text-amber-100 text-xl font-medium">USDT</span>
            <Snippet
              hideSymbol
              classNames={{ base: 'px-0 py-0 mt-1 bg-opacity-100 gap-0' }}
            >
              0x1e13...60Af
            </Snippet>
            <span className="text-amber-100 text-2xl font-medium">100.22</span>
            <span className="text-amber-100 text-medium font-normal">
              $100.00
            </span>
            <NomasDivider
              orientation="horizontal"
              className="pt-[5]px my-3 bg-amber-200"
            />
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-between items-center">
                <p className="text-amber-100 text-sm font-normal">To</p>
                <p>0x1e13fseteg53g34tg54u253y5y4c60</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-amber-100 text-sm font-normal">Chain</p>
                <div>
                  <NomasAvatar
                    className="w-5 h-5 inline-block mr-1"
                    src={tokenOutChainMetadata?.iconUrl}
                    alt={tokenOutChainMetadata?.name}
                  />
                  <span className="align-middle">
                    {tokenOutChainMetadata?.name}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <p className="text-amber-100 text-sm font-normal">Fee</p>
                  <NomasTooltip content={'The fee is charged by the network'}>
                    <InfoIcon />
                  </NomasTooltip>
                </div>
                <p className="text-amber-100 text-sm font-normal">$0.001</p>
              </div>
            </div>
          </div>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasCard className=" bg-emerald-400">
        <NomasCardBody>
          <p className="">Comment or memo</p>
          <p className="">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasButton
        className="py-6"
        onPress={() => {
          console.log('Withdraw');
        }}
      >
        Send
      </NomasButton>
    </>
  );
};
