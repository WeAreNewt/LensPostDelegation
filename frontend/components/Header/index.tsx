import { Button } from "../UI/Button"
import Login from "../../components/Login"
import { useState } from "react";
import { Modal } from "components/UI/Modal";
export const Header = (props: { connectWallet: any, connected: boolean, address: `0x${string}` | undefined }) => {

    const [showLoginModal, setShowLoginModal] = useState(false);

    const truncateAddress = (address: `0x${string}` | undefined) => {
        if (!address) return "Connect Wallet";
        const match = address.match(
            /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/
        );
        if (!match) return address;
        return `${match[1]}…${match[2]}`;
    };

    return (
        <div className='flex justify-between m-14'>
            <h1 className='text-4xl font-semibold'>Lens Post Delegation</h1>
            <Button onClick={props.connectWallet} className='w-48 h-12'> {props.connected ? truncateAddress(props.address) : 'Connect Wallet'} </Button>
            {/* <Button onClick={() => setShowLoginModal(!showLoginModal)} className='w-48 h-12'> {props.connected ? truncateAddress(props.address) : 'Connect Wallet'} </Button> */}

            {/* <Modal
                title="Login"
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            >
                <Login />
            </Modal> */}
        </div>
    )
}

