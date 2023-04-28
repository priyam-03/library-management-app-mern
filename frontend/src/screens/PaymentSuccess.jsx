
import React from 'react'
import { useSearchParams } from "react-router-dom"
const PaymentSuccess = () => {

    const seachQuery = useSearchParams()[0]

    const referenceNum = seachQuery.get("reference")
    return (
        <div>
            <div h="100vh" justifyContent={"center"}>

                <h1 textTransform={"uppercase"}> Order Successfull</h1>

                <p>
                    Reference No.{referenceNum}
                </p>

            </div>
        </div>
    )
}

export default PaymentSuccess