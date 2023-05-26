import { Box } from "@chakra-ui/react";
import { DividerWithText } from "../../layout/Divider/DividerWithText";
import { DateObjectToFormattedDateString } from "../../../utils/operations";
import { Message, MessagesWithDate } from "../../../types/Messaging/Message";
import { EmptyStateForChannel, EmptyStateForDM } from "../../layout/EmptyState/EmptyState";
import { useState } from "react";
import { ChatMessageBox } from "./ChatMessage/ChatMessageBox";
import { MarkdownRenderer } from "../markdown-viewer/MarkdownRenderer";
import { FileMessage } from "./ChatMessage/FileMessage";
import { ImageMessage } from "./ChatMessage/ImageMessage";
import { UserProfileDrawer } from "../user-details/UserProfileDrawer";
import { ModalTypes, useModalManager } from "../../../hooks/useModalManager";
import { User } from "../../../types/User/User";
import { FilePreviewModal } from "../file-preview/FilePreviewModal";
import { ContinuationChatMessageBox } from "./ChatMessage/ContinuationChatMessage";
import { Virtuoso } from 'react-virtuoso';

interface ChatHistoryProps {
    parsed_messages: MessagesWithDate
    isDM: number
}

export const ChatHistory = ({ parsed_messages, isDM }: ChatHistoryProps) => {
    const [isScrollable, setScrollable] = useState<boolean>(true)
    const handleScroll = (newState: boolean) => {
        setScrollable(newState)
    }

    const modalManager = useModalManager()

    const onOpenUserDetailsDrawer = (selectedUser: User) => {
        if (selectedUser) {
            modalManager.openModal(ModalTypes.UserDetails, selectedUser)
        }
    }

    const onFilePreviewModalOpen = (message: Message) => {
        if (message) {
            modalManager.openModal(ModalTypes.FilePreview, message)
        }
    }

    const renderItem = (block: { block_type: 'date' | 'message_group', data: any }) => {
        switch (block.block_type) {
            case 'date':
                return (
                    <Box p={4} key={block.data} zIndex={1} position={'relative'}>
                        <DividerWithText>{DateObjectToFormattedDateString(new Date(block.data))}</DividerWithText>
                    </Box>
                )
            case 'message_group':
                return block.data.map((message: Message, messageIndex: number) => {
                    const isFirstMessage = messageIndex === 0
                    const ChatMessageComponent = isFirstMessage ? ChatMessageBox : ContinuationChatMessageBox
                    const commonProps = {
                        key: message.name,
                        message: message,
                        handleScroll: handleScroll,
                    }
                    const additionalProps = isFirstMessage ? { onOpenUserDetailsDrawer } : {}
                    return (
                        <ChatMessageComponent {...commonProps} {...additionalProps}>
                            {message.message_type === 'Text' && message.text && <MarkdownRenderer content={message.text} />}
                            {message.message_type === 'File' && message.file && <FileMessage message={message} onFilePreviewModalOpen={onFilePreviewModalOpen} />}
                            {message.message_type === 'Image' && message.file && <ImageMessage message={message} onFilePreviewModalOpen={onFilePreviewModalOpen} />}
                        </ChatMessageComponent>
                    )
                })
            default:
                return null
        }
    }

    return (
        <>
            <Virtuoso
                style={{ height: '100%', overflowY: isScrollable ? 'scroll' : 'hidden' }}
                totalCount={parsed_messages.length}
                itemContent={index => renderItem(parsed_messages[index])}
                initialTopMostItemIndex={parsed_messages.length - 1}
                components={{
                    Header: () => (isDM === 1 ? <EmptyStateForDM /> : <EmptyStateForChannel />),
                }}
                alignToBottom={true}
                followOutput={'smooth'}
            />

            <UserProfileDrawer
                isOpen={modalManager.modalType === ModalTypes.UserDetails}
                onClose={modalManager.closeModal}
                user={modalManager.modalContext}
            />

            <FilePreviewModal
                isOpen={modalManager.modalType === ModalTypes.FilePreview}
                onClose={modalManager.closeModal}
                message={modalManager.modalContext}
            />
        </>
    )
}