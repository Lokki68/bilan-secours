'use client'

import {useBilan} from "@/context/BilanContext";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {BilanCirconstanciel} from "@/types/bilan.type";
import {useEffect} from "react";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Clock} from "lucide-react";

const TYPES_INTERVENTION = [
    'Malaise / Urgence médicale',
    'Traumatisme / Chute',
    'Accident de la voie publique',
    'Intoxication',
    'Détresse respiratoire',
    'Douleur thoracique',
    'AVC / Neurologique',
    'Obstrétrique',
    'Psychiatrique',
    'Autre'
]

export function CirconstancielForm() {
    const {bilan, updateCirconstanciel} = useBilan()
    const router = useRouter()

    const {register, handleSubmit, setValue, watch, formState: {isDirty}} = useForm<BilanCirconstanciel>(
        {
            defaultValues: {
                dateHeure: new Date().toISOString().slice(0, 16),
                nombreVictimes: 1,
                ...bilan.circonstanciel
            }
        }
    )

    useEffect(() => {
        const subscription = watch(data => {
            updateCirconstanciel(data as Partial<BilanCirconstanciel>)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateCirconstanciel]);

    const onSubmit = (data: BilanCirconstanciel) => {
        updateCirconstanciel(data)
        router.push('/bilan/primaire')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pb-8'>
            <Card className='bg-gray-900 border-gray-800'>
                <CardHeader className='pb-3' >
                    <CardTitle className='text-sm text-gray-300 flex items-center gap-2'>
                        <Clock className='h-4 w-4' />
                        Heure & Lieu
                    </CardTitle>
                </CardHeader>
            </Card>
        </form >
    )
}