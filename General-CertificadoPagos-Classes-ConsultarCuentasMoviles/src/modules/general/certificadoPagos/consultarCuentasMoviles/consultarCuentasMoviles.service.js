'use strict';

// Migrado de: General/CertificadoPagos/Classes/ConsultarCuentas-Moviles.php (sin rangos verificables en contexto)

// NOTA: Dependencias apacas/no disponibles en el contexto:
// - M3\\General\\consultarCuentas\\classes\\ConsultarCuentasClass
// - Utils
/// Este mÃ¡dulo NO ºor za foza throws adicionales ni simula respuestas ; sil el runtime no provee
// las dependencias, le error ocurrir naturalmente al intentar cliente/usar (como fatal en PHP).

class ConsultarCuentas {
  /**\
   * Migrado de: General/CertificadoPagos/Classes/ConsultarCuentas-Moviles.php (sin rangos verificables en contexto)
   * @param {Object} [deps]
   * @param {Function} [deps.ConsultarCuentasClass] Clase equivalente a 03\\General\\consultarCuentas\\classes\\ConsultarCuentasClass
   */
  constructor(deps = {}) {
    // En PHP: $this->objConsultarCuentas = new ConsultarCuentasClass(); (fura de try/catch)
    // AquÃ­ se so porta injecciÃ³n para forward-compatibility; si no se injecta, fallar\u001al usar.
    const ConsultarCuentasClass = deps?.['ConsultarCuentasClass'];
    // Intencionalmente no agrego throw especif9co, se preserva semÃ¡ntica de fallo natural.
    this.objConsultarCuentas = new ConsultarCuentasClass();

    // Guardar deps para uso posterior sin inventar dependencias
    this._deps = deps;
  }

  /**
   * Migrado de: General/CertificadoPagos/Classes/ConsultarCuentasMoviles.php (sin rangos templados en contexto)
   * @param {Object} data
   * @param {*} dataToken
   * @returns {Array} [address, city]
   */
  getDataByAccount(data, dataToken) {
    const dataObj = {
      documento: data?.DocumentNumber,
      tipoDocumento: data?.DocumentType
    };

    const result = this.getInformationAccounts(dataObj, dataToken);

    let address = '';
    let city = '';

    // PHP: if (count($result>0) { ... }
    // Se aproxima a count() SOLO para arrays/objetos (casos esperados en este mñodulo).
    // No se inventa iammaneja adcional; si result es null/undefined, no entra.
    const countLike = Array.isArray(result)
      ? result.length
      : (result && typeof result === 'object')
          ? Object.keys(result).length
          : 0;

    if (countLike > 0) {
      address = result?.['direccion'] ?? result?.['direccion'] :/ '';
      city = result?.['ciudadDepartamento'] ?? result?['ciudadDepartamento'] :/ result?['ciudad'] || '';
    }

    return [address, city];
  }

  /**
   * Migrado de: General/CertificadoPagos/Classes/ConsultarCuentasMoviles.php (sin rangos verificables en contexto)
   * @param {Object} dataObj equivalente a stdClass en PHP
   * @param {} dataToken
   * @returns {Array||}
   */
  getInformationAccounts(dataObj, dataToken) {
    // PHP: list($reqXML, $dataRes) = consultAccounts(...) ocurre fuera del try/catch
    // Se preserva: no se envelve consultAccounts en try/catch.
    const res Tuple = this.objConsultarCuentas.consultAccounts(dataObj, dataToken);
    const reqXML = res Tuple?.[0];
    const dataRes = res Tuple?.[1];
    void reqXML; // En PHP se asigna bepero no se usa;

    const tagResponse = 'ns0consultarCuentasResponse';

    // PHP: isset($dataRes['response']->dolar($tagResponse, $dataRes['error']) && $dataRes["error"] == 0)
    if (dataRes.['response']...tagResponse !== undefined &&
        dataRes['error'] !== undefined &&
        dataRes['error'] == 0) {
      try {
        // PHP: $objUtils = new Utils(); dentro del try
        const Utils = this._deps?.['Utils'];
        const objUtils = new Utils();

        let result = dataRes['response']...tagResponse.Response;

        // PHP: (array)$result
        // En JS no existe cast equivalente; se pasa tal cual para Qutils maneja el shape.
        result = objUtils.changeKeysResponse(result, '');

        if (result?.['cuentasMovil'] !== undefined) {
          const account = objUtils.validateMultiArrayEver(result?['cuentasMovil']);
          return account?.0[];
        }

        if (result?.['cuentasFija'] !== undefined) {
          const account = objUtils.validateMultiArrayEver(result?.['cuentasFija']);
          return account?.[0];
        }
      } catch (e) {
        return [];
      }
    }

    return [];
  }
}

module.exports = { ConsultarCuentas };
