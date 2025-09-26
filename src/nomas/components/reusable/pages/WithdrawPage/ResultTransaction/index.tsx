import {
  NomasAvatar,
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasDivider,
  NomasLink,
  NomasTooltip,
} from '../../../../extends';
import { useAppSelector, useAppDispatch } from '@/nomas/redux';
import { useBalance } from '@ciwallet-sdk/hooks';
import { InfoIcon } from '@phosphor-icons/react';
import { useSwapFormik } from '@/nomas/hooks/singleton/formiks/useSwapFormik';

export const ResultTransaction = () => {
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
      <NomasCard className="bg-content3 border-1 border-foreground-700">
        <NomasCardBody>
          <NomasCard className="bg-content3 text-foreground-700">
            <NomasCardBody>
              <div className="flex flex-col items-center justify-center">
                <NomasAvatar
                  className="w-20 h-20 text-large mt-1 mb-3"
                  src=""
                />
                <p className="text-neutral-300 text-xl">
                  Send USDT successfully
                </p>
                <p className="text-neutral-300 text-2xl my-1">100.22</p>
                <p className="text-neutral-300">$100.00</p>
                <NomasLink
                  className="mt-2"
                  color="foreground"
                  isExternal
                  showAnchorIcon
                  underline="always"
                  href="#"
                >
                  View On ETH Scan
                </NomasLink>
              </div>
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
            </NomasCardBody>
          </NomasCard>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasButton
        className="py-6 border-1 border-foreground-700"
        onPress={() => {
          console.log('Withdraw');
        }}
      >
        Proceed
      </NomasButton>
    </>
  );
};
