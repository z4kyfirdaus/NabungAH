export function cekNotifikasi(data){

    const target = data.targets.find(item => item.aktif)

    if(!target) return null

    if(target.saldo >= target.target){
        return {
            tipe:'success',
            pesan:`🎉 Target ${target.nama} berhasil tercapai!`
        }
    }

    const sekarang = new Date()

    const deadline = new Date(target.deadline)

    const sisaHari = Math.ceil(
        (deadline - sekarang)/(1000*60*60*24)
    )

    if(sisaHari<=7){
        return{
            tipe:'warning',
            pesan:`⚠️ Deadline tinggal ${sisaHari} hari`
        }
    }

    return{
        tipe:'info',
        pesan:'💰 Jangan lupa menabung hari ini.'
    }

}