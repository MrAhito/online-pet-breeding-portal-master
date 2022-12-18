import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble'

function MessageBubbleDiv(props) {

    const messageEl = useRef(null);


    useEffect(() => {
        if (messageEl) {
            messageEl.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [])
    return (
        <>

            <div className="messageDa" ref={messageEl}>
                {props.userDefault && <> <div className="RecieverMsg">
                    {props.userDefault.profile ? <div className='dp-wrapper' style={{ width: "16vh", height: "15vh" }} >
                        <img className='adProp ' src={props.userDefault.profile} alt='dp' /></div>
                        :
                        <div style={{ backgroundColor: props.userDefault.bgColor }} className='dp-wrapper fias' >
                            {props.userDefault.first_name !== undefined && props.userDefault.first_name[0]}
                        </div>}
                    <h3>{props.userDefault ? props.userDefault.first_name + ' ' + props.userDefault.last_name : ' '}</h3>
                    <h5>{props.userDefault ? props.userDefault.type : ''}</h5>
                    <span>{props.userDefault ? 'Lives at ' + props.userDefault.address : ' '}</span>
                </div>
                </>}

                {props.convo && props.convo.map((convom, index) => { return <MessageBubble staus={props.statasad} userDefault={props.userDefault} convom={convom} key={index} /> })}
            </div>
        </>

    )
}

export default MessageBubbleDiv
