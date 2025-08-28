import React from "react"
import {
    Modal,
    type ModalProps,
    type HTMLHeroUIProps,
    type ModalContentProps,
} from "@heroui/react"
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalContent,
} from "@heroui/react"

export const NomasModal = (props: ModalProps) => {
    return <Modal {...props} />
}

export const NomasModalContent = (props: ModalContentProps) => {
    return <ModalContent {...props} />
}

export const NomasModalHeader = (props: HTMLHeroUIProps<"div">) => {
    return <ModalHeader {...props} />
}

export const NomasModalBody = (props: HTMLHeroUIProps<"div">) => {
    return <ModalBody {...props} />
}

export const NomasModalFooter = (props: HTMLHeroUIProps<"div">) => {
    return <ModalFooter {...props} />
}
