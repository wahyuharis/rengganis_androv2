function penjualan_detail_list(){
    var self=this;
    
    
}

function Detail_transaksi_model() {
    var self = this;
    
    self.id_penjualan=ko.observable('');
    
    self.kode_transaksi=ko.observable('');
    self.tanggal=ko.observable('');
    self.atas_nama=ko.observable('');
    
    self.penjualan_detail=ko.observableArray([]);

}

$('#detail_transaksi').ready(function () {
    ko.applyBindings(new Detail_transaksi_model(), document.getElementById("detail_transaksi"));

});